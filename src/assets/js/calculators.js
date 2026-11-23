/* ==========================================================================
   CalcLedger Interactive Calculators (100% Client-Side Vanilla JS)
   1. VAT / MwSt   2. Marketplace Profit   3. Margin & Markup
   4. Freelance B2B Rate   5. Compound Interest & ROI + SVG Chart
   ========================================================================== */

(function () {
  'use strict';

  function bindCurrencySwitcher(container, initialCurrency, onChange) {
    let current = initialCurrency || 'EUR';
    const buttons = container.querySelectorAll('[data-currency-btn]');

    function setCurrency(code, silent) {
      if (!window.CalcLedger.CURRENCY_META[code]) return;
      current = code;
      buttons.forEach((btn) => {
        const active = btn.getAttribute('data-currency-btn') === code;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      if (!silent) onChange(current);
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => setCurrency(btn.getAttribute('data-currency-btn'), false));
    });

    return {
      get: () => current,
      set: setCurrency,
    };
  }

  /* ------------------------------------------------------------------------
     1. VAT / MwSt Calculator
     ------------------------------------------------------------------------ */
  function initVat(shell) {
    const CL = window.CalcLedger;
    const I18N = CL.I18N;
    const defaultCurrency = shell.getAttribute('data-default-currency') || 'EUR';
    const defaultRate = CL.parseNum(shell.getAttribute('data-default-rate'), 19);

    const elAmount = document.getElementById('vat-amount');
    const elAmountLabel = document.getElementById('vat-amount-label');
    const elRate = document.getElementById('vat-rate');
    const elPrimaryLabel = document.getElementById('vat-primary-label');
    const outPrimary = document.getElementById('vat-out-primary');
    const outNet = document.getElementById('vat-out-net');
    const outVat = document.getElementById('vat-out-vat');
    const outGross = document.getElementById('vat-out-gross');
    const outShare = document.getElementById('vat-out-share');
    const barNet = document.getElementById('vat-bar-net');
    const barVat = document.getElementById('vat-bar-vat');
    const legNet = document.getElementById('vat-legend-net');
    const legVat = document.getElementById('vat-legend-vat');

    let mode = 'add'; // 'add' (Net->Gross) | 'remove' (Gross->Net)
    let lastSummary = '';

    const currency = bindCurrencySwitcher(shell, defaultCurrency, () => calculate(true));

    function setMode(nextMode, sync) {
      mode = nextMode === 'remove' ? 'remove' : 'add';
      shell.querySelectorAll('[data-vat-mode]').forEach((btn) => {
        const active = btn.getAttribute('data-vat-mode') === mode;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      elAmountLabel.textContent = mode === 'add' ? I18N.vat.amountLabelNet : I18N.vat.amountLabelGross;
      elPrimaryLabel.textContent = mode === 'add' ? I18N.vat.resultGross : I18N.vat.resultNet;
      calculate(sync);
    }

    function updateRatePills(rateVal) {
      shell.querySelectorAll('[data-vat-rate]').forEach((btn) => {
        const r = CL.parseNum(btn.getAttribute('data-vat-rate'), -1);
        btn.classList.toggle('is-active', Math.abs(r - rateVal) < 0.001);
      });
    }

    function getState() {
      return {
        cur: currency.get(),
        mode,
        amount: elAmount.value,
        rate: elRate.value,
      };
    }

    function calculate(syncUrl) {
      const amount = Math.max(0, CL.parseNum(elAmount.value, 0));
      const rate = Math.max(0, Math.min(100, CL.parseNum(elRate.value, 0)));
      const factor = 1 + rate / 100;

      let net = 0;
      let gross = 0;
      if (mode === 'add') {
        net = amount;
        gross = amount * factor;
      } else {
        gross = amount;
        net = factor > 0 ? amount / factor : amount;
      }
      const vat = gross - net;
      const vatShare = gross > 0 ? (vat / gross) * 100 : 0;
      const netShare = gross > 0 ? (net / gross) * 100 : 100;

      const cur = currency.get();
      outPrimary.textContent = CL.formatMoney(mode === 'add' ? gross : net, cur);
      outNet.textContent = CL.formatMoney(net, cur);
      outVat.textContent = CL.formatMoney(vat, cur);
      outGross.textContent = CL.formatMoney(gross, cur);
      outShare.textContent = CL.formatPercent(vatShare, 2);

      barNet.style.width = `${netShare.toFixed(2)}%`;
      barVat.style.width = `${vatShare.toFixed(2)}%`;
      legNet.textContent = CL.formatPercent(netShare, 1);
      legVat.textContent = CL.formatPercent(vatShare, 1);

      updateRatePills(rate);

      lastSummary = [
        `${I18N.vat.resultNet}: ${CL.formatMoney(net, cur)}`,
        `${I18N.vat.resultVat} (${rate}%): ${CL.formatMoney(vat, cur)}`,
        `${I18N.vat.resultGross}: ${CL.formatMoney(gross, cur)}`,
      ].join(' | ');

      if (syncUrl) CL.syncUrlState(getState());
    }

    // Hydrate from URL params
    const params = CL.readParams();
    if (params.has('cur')) currency.set(params.get('cur').toUpperCase(), true);
    if (params.has('amount')) elAmount.value = params.get('amount');
    if (params.has('rate')) elRate.value = params.get('rate');
    setMode(params.get('mode') === 'remove' ? 'remove' : 'add', false);

    // Events
    shell.querySelectorAll('[data-vat-mode]').forEach((btn) => {
      btn.addEventListener('click', () => setMode(btn.getAttribute('data-vat-mode'), true));
    });

    shell.querySelectorAll('[data-vat-rate]').forEach((btn) => {
      btn.addEventListener('click', () => {
        elRate.value = btn.getAttribute('data-vat-rate');
        calculate(true);
      });
    });

    shell.querySelectorAll('[data-vat-amount]').forEach((btn) => {
      btn.addEventListener('click', () => {
        elAmount.value = btn.getAttribute('data-vat-amount');
        calculate(true);
      });
    });

    elAmount.addEventListener('input', () => calculate(true));
    elRate.addEventListener('input', () => calculate(true));

    document.getElementById('vat-copy-result').addEventListener('click', () => {
      CL.copyText(lastSummary, I18N.copiedResult);
    });
    document.getElementById('vat-copy-link').addEventListener('click', () => {
      CL.copyText(CL.buildShareUrl(getState()), I18N.copiedLink);
    });
    document.getElementById('vat-reset').addEventListener('click', () => {
      currency.set(defaultCurrency, true);
      elAmount.value = '1000';
      elRate.value = String(defaultRate);
      setMode('add', true);
    });
  }

  /* ------------------------------------------------------------------------
     2. Marketplace Seller Profit & Fee Calculator
     ------------------------------------------------------------------------ */
  function initMarketplace(shell) {
    const CL = window.CalcLedger;
    const I18N = CL.I18N;
    const PRESETS = window.CALCLEDGER_MP_PRESETS || {};
    const ORDER = window.CALCLEDGER_MP_ORDER || Object.keys(PRESETS);
    const defaultCurrency = shell.getAttribute('data-default-currency') || 'EUR';
    const defaultPresetKey = shell.getAttribute('data-default-preset') || '';

    const elPreset = document.getElementById('mp-preset');
    const elPrice = document.getElementById('mp-price');
    const elBuyerShip = document.getElementById('mp-buyer-ship');
    const elCogs = document.getElementById('mp-cogs');
    const elSellerShip = document.getElementById('mp-seller-ship');
    const elComm = document.getElementById('mp-comm');
    const elPayPct = document.getElementById('mp-pay-pct');
    const elFixedFee = document.getElementById('mp-fixed-fee');
    const elAcos = document.getElementById('mp-acos');
    const elReturns = document.getElementById('mp-returns');
    const elOrders = document.getElementById('mp-orders');
    const elVatEnabled = document.getElementById('mp-vat-enabled');
    const elVatRate = document.getElementById('mp-vat-rate');
    const elVatWrap = document.getElementById('mp-vat-rate-wrap');

    const initialSnapshot = {
      preset: elPreset.value,
      price: elPrice.value,
      buyerShip: elBuyerShip.value,
      cogs: elCogs.value,
      sellerShip: elSellerShip.value,
      comm: elComm.value,
      payPct: elPayPct.value,
      fixedFee: elFixedFee.value,
      acos: elAcos.value,
      returns: elReturns.value,
      orders: elOrders.value,
      vatEnabled: elVatEnabled.checked,
      vatRate: elVatRate.value,
    };

    const heroBox = document.getElementById('mp-hero-box');
    const monthlyBox = document.getElementById('mp-monthly-box');
    const outProfit = document.getElementById('mp-out-profit');
    const outMonthly = document.getElementById('mp-out-monthly');
    const outMargin = document.getElementById('mp-out-margin');
    const outRoi = document.getElementById('mp-out-roi');
    const outFees = document.getElementById('mp-out-fees');
    const outAds = document.getElementById('mp-out-ads');
    const outVat = document.getElementById('mp-out-vat');
    const outBePrice = document.getElementById('mp-out-be-price');
    const outTargetLabel = document.getElementById('mp-target-price-label');
    const outTargetPrice = document.getElementById('mp-out-target-price');
    const outBeAcos = document.getElementById('mp-out-be-acos');
    const compareBody = document.getElementById('mp-compare-body');

    const segCogs = document.getElementById('mp-seg-cogs');
    const segFees = document.getElementById('mp-seg-fees');
    const segAds = document.getElementById('mp-seg-ads');
    const segVat = document.getElementById('mp-seg-vat');
    const segProfit = document.getElementById('mp-seg-profit');
    const elLegend = document.getElementById('mp-legend');

    let targetMarginPct = 25;
    let lastSummary = '';
    const currency = bindCurrencySwitcher(shell, defaultCurrency, () => calculate(true));

    function updateTargetMarginPills() {
      shell.querySelectorAll('[data-mp-target-margin]').forEach((btn) => {
        const val = CL.parseNum(btn.getAttribute('data-mp-target-margin'), 25);
        btn.classList.toggle('is-active', Math.abs(val - targetMarginPct) < 0.01);
      });
      if (outTargetLabel) {
        outTargetLabel.textContent = I18N.marketplace.outTargetPrice.replace('{pct}', String(targetMarginPct));
      }
    }

    function evaluateMetrics({
      price,
      buyerShip,
      cogs,
      sellerShip,
      commPct,
      payPct,
      fixedFee,
      acosPct,
      returnsPct,
      monthlyOrders,
      vatOn,
      vatRate,
      targetMargin,
    }) {
      const grossRevenue = price + buyerShip;
      const vatFactor = vatOn && vatRate > 0 ? (vatRate / 100) / (1 + vatRate / 100) : 0;
      const vatAmount = grossRevenue * vatFactor;
      const pctFees = grossRevenue * ((commPct + payPct) / 100);
      const totalFees = pctFees + fixedFee;
      const adCost = grossRevenue * (acosPct / 100);
      const directCost = cogs + sellerShip;

      const r = Math.max(0, Math.min(0.6, returnsPct / 100));
      const netProfitSingle = grossRevenue - vatAmount - totalFees - adCost - directCost;
      const returnLoss = sellerShip + adCost + fixedFee;
      const expectedNetProfit = (1 - r) * netProfitSingle - r * returnLoss;
      const monthlyProfit = expectedNetProfit * monthlyOrders;

      const marginPct = grossRevenue > 0 ? (expectedNetProfit / grossRevenue) * 100 : 0;
      const roiBase = directCost > 0 ? directCost : cogs;
      const roiPct = roiBase > 0 ? (expectedNetProfit / roiBase) * 100 : 0;

      // Closed-form Break-Even Selling Price & Target Margin Price (generalized for return rate r)
      const fixedNumerator = (1 - r) * cogs + sellerShip + fixedFee;
      const beDenom = (1 - r) * (1 - vatFactor - (commPct + payPct) / 100) - acosPct / 100;
      let bePrice = null;
      if (beDenom > 0.001) {
        bePrice = Math.max(0, fixedNumerator / beDenom - buyerShip);
      }

      const tmDenom = beDenom - targetMargin / 100;
      let targetPrice = null;
      if (tmDenom > 0.001) {
        targetPrice = Math.max(0, fixedNumerator / tmDenom - buyerShip);
      }

      const profitBeforeAds = (1 - r) * (grossRevenue - vatAmount - totalFees - directCost) - r * (sellerShip + fixedFee);
      const beAcos = grossRevenue > 0 ? (profitBeforeAds / grossRevenue) * 100 : 0;

      return {
        grossRevenue,
        vatAmount,
        totalFees,
        adCost,
        directCost,
        expectedNetProfit,
        monthlyProfit,
        marginPct,
        roiBase,
        roiPct,
        bePrice,
        targetPrice,
        beAcos,
      };
    }

    function applyPreset(key, sync) {
      const p = PRESETS[key];
      if (!p) return;
      elPrice.value = p.price;
      elBuyerShip.value = p.buyerShipping;
      elCogs.value = p.cogs;
      elSellerShip.value = p.sellerShipping;
      elComm.value = p.commissionPct;
      elPayPct.value = p.paymentPct;
      elFixedFee.value = p.fixedFee;
      elAcos.value = p.acosPct;
      elVatEnabled.checked = Boolean(p.vatRegistered);
      if (p.vatPct) elVatRate.value = p.vatPct;
      if (p.currency) currency.set(p.currency, true);
      calculate(sync);
    }

    function applyPresetFeesOnly(key) {
      const p = PRESETS[key];
      if (!p) return;
      elPreset.value = key;
      elComm.value = p.commissionPct;
      elPayPct.value = p.paymentPct;
      elFixedFee.value = p.fixedFee;
      calculate(true);
      shell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function getState() {
      return {
        cur: currency.get(),
        preset: elPreset.value,
        price: elPrice.value,
        bship: elBuyerShip.value,
        cogs: elCogs.value,
        sship: elSellerShip.value,
        comm: elComm.value,
        pay: elPayPct.value,
        fix: elFixedFee.value,
        acos: elAcos.value,
        ret: elReturns.value,
        ord: elOrders.value,
        tm: String(targetMarginPct),
        vatOn: elVatEnabled.checked ? '1' : '0',
        vat: elVatRate.value,
      };
    }

    function renderComparisonTable(baseInputs, cur) {
      if (!compareBody) return;
      const rows = ORDER.filter((k) => PRESETS[k]).map((key) => {
        const p = PRESETS[key];
        const m = evaluateMetrics({
          ...baseInputs,
          commPct: p.commissionPct,
          payPct: p.paymentPct,
          fixedFee: p.fixedFee,
        });
        return { key, name: p.name || key, ...m };
      });

      let bestKey = '';
      let bestProfit = 0;
      rows.forEach((row) => {
        if (row.expectedNetProfit > bestProfit) {
          bestProfit = row.expectedNetProfit;
          bestKey = row.key;
        }
      });

      const activeKey = elPreset.value;
      compareBody.innerHTML = rows
        .map((row) => {
          const isBest = row.key === bestKey && bestProfit > 0;
          const isActive = row.key === activeKey;
          const profitCls = row.expectedNetProfit < 0 ? ' is-negative' : '';
          const badgeHtml = isBest ? `<span class="badge-best">${I18N.marketplace.bestBadge}</span>` : '';
          return `<tr class="clickable-row${isActive ? ' is-selected' : ''}" data-mp-compare="${row.key}" tabindex="0">
            <td><strong>${row.name}</strong>${badgeHtml}</td>
            <td class="num">${CL.formatMoney(row.totalFees, cur)}</td>
            <td class="num${profitCls}"><strong>${CL.formatMoney(row.expectedNetProfit, cur)}</strong></td>
            <td class="num${profitCls}">${CL.formatPercent(row.marginPct, 1)}</td>
            <td class="num">${CL.formatPercent(Math.max(0, row.beAcos), 1)}</td>
            <td class="num${profitCls}"><strong>${CL.formatMoney(row.monthlyProfit, cur)}</strong></td>
          </tr>`;
        })
        .join('');

      compareBody.querySelectorAll('[data-mp-compare]').forEach((tr) => {
        const activate = () => applyPresetFeesOnly(tr.getAttribute('data-mp-compare'));
        tr.addEventListener('click', activate);
        tr.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
          }
        });
      });
    }

    function calculate(syncUrl) {
      const price = Math.max(0, CL.parseNum(elPrice.value, 0));
      const buyerShip = Math.max(0, CL.parseNum(elBuyerShip.value, 0));
      const cogs = Math.max(0, CL.parseNum(elCogs.value, 0));
      const sellerShip = Math.max(0, CL.parseNum(elSellerShip.value, 0));
      const commPct = Math.max(0, Math.min(100, CL.parseNum(elComm.value, 0)));
      const payPct = Math.max(0, Math.min(100, CL.parseNum(elPayPct.value, 0)));
      const fixedFee = Math.max(0, CL.parseNum(elFixedFee.value, 0));
      const acosPct = Math.max(0, Math.min(100, CL.parseNum(elAcos.value, 0)));
      const returnsPct = Math.max(0, Math.min(60, CL.parseNum(elReturns.value, 0)));
      const monthlyOrders = Math.max(1, Math.round(CL.parseNum(elOrders.value, 50)));
      const vatOn = elVatEnabled.checked;
      const vatRate = Math.max(0, Math.min(100, CL.parseNum(elVatRate.value, 0)));

      elVatWrap.hidden = !vatOn;
      updateTargetMarginPills();

      const baseInputs = {
        price,
        buyerShip,
        cogs,
        sellerShip,
        commPct,
        payPct,
        fixedFee,
        acosPct,
        returnsPct,
        monthlyOrders,
        vatOn,
        vatRate,
        targetMargin: targetMarginPct,
      };
      const res = evaluateMetrics(baseInputs);
      const cur = currency.get();

      const bePriceText = res.bePrice !== null ? CL.formatMoney(res.bePrice, cur) : '—';
      const targetPriceText = res.targetPrice !== null ? CL.formatMoney(res.targetPrice, cur) : '—';

      heroBox.classList.toggle('is-loss', res.expectedNetProfit < 0);
      if (monthlyBox) monthlyBox.classList.toggle('is-loss', res.monthlyProfit < 0);
      outProfit.textContent = CL.formatMoney(res.expectedNetProfit, cur);
      if (outMonthly) outMonthly.textContent = CL.formatMoney(res.monthlyProfit, cur);
      outMargin.textContent = CL.formatPercent(res.marginPct, 2);
      outRoi.textContent = res.roiBase > 0 ? CL.formatPercent(res.roiPct, 1) : '—';
      outFees.textContent = CL.formatMoney(res.totalFees, cur);
      outAds.textContent = CL.formatMoney(res.adCost, cur);
      outVat.textContent = CL.formatMoney(res.vatAmount, cur);
      outBePrice.textContent = bePriceText;
      if (outTargetPrice) outTargetPrice.textContent = targetPriceText;
      outBeAcos.textContent = CL.formatPercent(Math.max(0, res.beAcos), 2);

      // Update proportional breakdown bar
      const totalBarDenom = Math.max(
        res.grossRevenue,
        res.directCost + res.totalFees + res.adCost + res.vatAmount + Math.max(0, res.expectedNetProfit),
        0.01
      );
      const wCogs = (res.directCost / totalBarDenom) * 100;
      const wFees = (res.totalFees / totalBarDenom) * 100;
      const wAds = (res.adCost / totalBarDenom) * 100;
      const wVat = (res.vatAmount / totalBarDenom) * 100;
      const wProfit = (Math.max(0, res.expectedNetProfit) / totalBarDenom) * 100;

      segCogs.style.width = `${wCogs.toFixed(2)}%`;
      segFees.style.width = `${wFees.toFixed(2)}%`;
      segAds.style.width = `${wAds.toFixed(2)}%`;
      segVat.style.width = `${wVat.toFixed(2)}%`;
      segProfit.style.width = `${wProfit.toFixed(2)}%`;

      const legendParts = [
        { cls: 'seg-navy', label: I18N.marketplace.segCogs, pct: res.grossRevenue > 0 ? (res.directCost / res.grossRevenue) * 100 : 0 },
        { cls: 'seg-amber', label: I18N.marketplace.segFees, pct: res.grossRevenue > 0 ? (res.totalFees / res.grossRevenue) * 100 : 0 },
        { cls: 'seg-terra', label: I18N.marketplace.segAds, pct: res.grossRevenue > 0 ? (res.adCost / res.grossRevenue) * 100 : 0 },
      ];
      if (vatOn) {
        legendParts.push({ cls: 'seg-slate', label: I18N.marketplace.segVat, pct: res.grossRevenue > 0 ? (res.vatAmount / res.grossRevenue) * 100 : 0 });
      }
      legendParts.push({
        cls: res.expectedNetProfit >= 0 ? 'seg-emerald' : 'seg-terra',
        label: res.expectedNetProfit >= 0 ? I18N.marketplace.segProfit : I18N.marketplace.segLoss,
        pct: res.marginPct,
      });

      elLegend.innerHTML = legendParts
        .map(
          (item) =>
            `<span><i class="dot ${item.cls}"></i>${item.label} <strong class="num">${CL.formatPercent(item.pct, 1)}</strong></span>`
        )
        .join('');

      renderComparisonTable(baseInputs, cur);

      lastSummary = [
        `${I18N.marketplace.outNetProfit}: ${CL.formatMoney(res.expectedNetProfit, cur)} (${CL.formatPercent(res.marginPct, 2)})`,
        `${I18N.marketplace.outMonthlyProfit} (${monthlyOrders}): ${CL.formatMoney(res.monthlyProfit, cur)}`,
        `${I18N.marketplace.outTotalFees}: ${CL.formatMoney(res.totalFees, cur)}`,
        `${I18N.marketplace.outBreakEvenPrice}: ${bePriceText}`,
        `${I18N.marketplace.outBreakEvenAcos}: ${CL.formatPercent(Math.max(0, res.beAcos), 2)}`,
      ].join(' | ');

      if (syncUrl) CL.syncUrlState(getState());
    }

    // Hydrate from URL params
    const params = CL.readParams();
    if (params.has('preset') && PRESETS[params.get('preset')]) {
      elPreset.value = params.get('preset');
    }
    if (params.has('cur')) currency.set(params.get('cur').toUpperCase(), true);
    if (params.has('price')) elPrice.value = params.get('price');
    if (params.has('bship')) elBuyerShip.value = params.get('bship');
    if (params.has('cogs')) elCogs.value = params.get('cogs');
    if (params.has('sship')) elSellerShip.value = params.get('sship');
    if (params.has('comm')) elComm.value = params.get('comm');
    if (params.has('pay')) elPayPct.value = params.get('pay');
    if (params.has('fix')) elFixedFee.value = params.get('fix');
    if (params.has('acos')) elAcos.value = params.get('acos');
    if (params.has('ret')) elReturns.value = params.get('ret');
    if (params.has('ord')) elOrders.value = params.get('ord');
    if (params.has('tm')) targetMarginPct = Math.max(1, Math.min(80, CL.parseNum(params.get('tm'), 25)));
    if (params.has('vatOn')) elVatEnabled.checked = params.get('vatOn') === '1';
    if (params.has('vat')) elVatRate.value = params.get('vat');

    calculate(false);

    elPreset.addEventListener('change', () => {
      if (elPreset.value !== 'custom') applyPreset(elPreset.value, true);
    });

    shell.querySelectorAll('[data-mp-target-margin]').forEach((btn) => {
      btn.addEventListener('click', () => {
        targetMarginPct = CL.parseNum(btn.getAttribute('data-mp-target-margin'), 25);
        calculate(true);
      });
    });

    [elPrice, elBuyerShip, elCogs, elSellerShip, elComm, elPayPct, elFixedFee, elAcos, elReturns, elOrders, elVatRate].forEach((input) => {
      input.addEventListener('input', () => calculate(true));
    });
    elVatEnabled.addEventListener('change', () => calculate(true));

    document.getElementById('mp-copy-result').addEventListener('click', () => {
      CL.copyText(lastSummary, I18N.copiedResult);
    });
    document.getElementById('mp-copy-link').addEventListener('click', () => {
      CL.copyText(CL.buildShareUrl(getState()), I18N.copiedLink);
    });
    document.getElementById('mp-reset').addEventListener('click', () => {
      elReturns.value = initialSnapshot.returns;
      elOrders.value = initialSnapshot.orders;
      targetMarginPct = 25;
      if (defaultPresetKey && PRESETS[defaultPresetKey]) {
        elPreset.value = defaultPresetKey;
        applyPreset(defaultPresetKey, true);
      } else {
        currency.set(defaultCurrency, true);
        elPreset.value = initialSnapshot.preset;
        elPrice.value = initialSnapshot.price;
        elBuyerShip.value = initialSnapshot.buyerShip;
        elCogs.value = initialSnapshot.cogs;
        elSellerShip.value = initialSnapshot.sellerShip;
        elComm.value = initialSnapshot.comm;
        elPayPct.value = initialSnapshot.payPct;
        elFixedFee.value = initialSnapshot.fixedFee;
        elAcos.value = initialSnapshot.acos;
        elVatEnabled.checked = initialSnapshot.vatEnabled;
        elVatRate.value = initialSnapshot.vatRate;
        calculate(true);
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Profit Margin & Markup Calculator
     ------------------------------------------------------------------------ */
  function initMargin(shell) {
    const CL = window.CalcLedger;
    const I18N = CL.I18N;
    const defaultCurrency = shell.getAttribute('data-default-currency') || 'EUR';

    const elMode = document.getElementById('margin-mode');
    const elCost = document.getElementById('margin-cost');
    const elPrice = document.getElementById('margin-price');
    const elTargetMargin = document.getElementById('margin-target-margin');
    const elTargetMarkup = document.getElementById('margin-target-markup');

    const wrapPrice = document.getElementById('margin-price-wrap');
    const wrapTargetMargin = document.getElementById('margin-target-margin-wrap');
    const wrapTargetMarkup = document.getElementById('margin-target-markup-wrap');

    const outMargin = document.getElementById('margin-out-margin');
    const outMarkup = document.getElementById('margin-out-markup');
    const outProfit = document.getElementById('margin-out-profit');
    const outPrice = document.getElementById('margin-out-price');
    const outMult = document.getElementById('margin-out-mult');
    const barCost = document.getElementById('margin-bar-cost');
    const barProfit = document.getElementById('margin-bar-profit');
    const legCost = document.getElementById('margin-legend-cost');
    const legProfit = document.getElementById('margin-legend-profit');

    let lastSummary = '';
    const currency = bindCurrencySwitcher(shell, defaultCurrency, () => calculate(true));

    function updateVisibility() {
      const m = elMode.value;
      wrapPrice.hidden = m !== 'cost-price';
      wrapTargetMargin.hidden = m !== 'cost-margin';
      wrapTargetMarkup.hidden = m !== 'cost-markup';
    }

    function getState() {
      return {
        cur: currency.get(),
        mode: elMode.value,
        cost: elCost.value,
        price: elPrice.value,
        tm: elTargetMargin.value,
        tmk: elTargetMarkup.value,
      };
    }

    function calculate(syncUrl) {
      updateVisibility();
      const mode = elMode.value;
      const cost = Math.max(0, CL.parseNum(elCost.value, 0));

      let price = 0;
      if (mode === 'cost-price') {
        price = Math.max(0, CL.parseNum(elPrice.value, 0));
      } else if (mode === 'cost-margin') {
        const tm = Math.min(99.9, Math.max(-500, CL.parseNum(elTargetMargin.value, 0)));
        price = tm < 100 ? cost / (1 - tm / 100) : 0;
      } else {
        const tmk = Math.max(-100, CL.parseNum(elTargetMarkup.value, 0));
        price = cost * (1 + tmk / 100);
      }

      const profit = price - cost;
      const margin = price > 0 ? (profit / price) * 100 : 0;
      const markup = cost > 0 ? (profit / cost) * 100 : 0;
      const mult = cost > 0 ? price / cost : 0;
      const costPct = price > 0 ? Math.min(100, Math.max(0, (cost / price) * 100)) : 100;
      const profitPct = Math.max(0, 100 - costPct);

      const cur = currency.get();
      outMargin.textContent = CL.formatPercent(margin, 2);
      outMarkup.textContent = CL.formatPercent(markup, 2);
      outProfit.textContent = CL.formatMoney(profit, cur);
      outPrice.textContent = CL.formatMoney(price, cur);
      outMult.textContent = `${mult.toFixed(3)}×`;

      barCost.style.width = `${costPct.toFixed(2)}%`;
      barProfit.style.width = `${profitPct.toFixed(2)}%`;
      legCost.textContent = CL.formatPercent(costPct, 1);
      legProfit.textContent = CL.formatPercent(margin, 1);

      document.querySelectorAll('[data-apply-margin]').forEach((row) => {
        const rowM = CL.parseNum(row.getAttribute('data-apply-margin'), -1);
        row.classList.toggle('is-selected', Math.abs(rowM - margin) < 0.05);
      });

      lastSummary = [
        `${I18N.margin.outPrice}: ${CL.formatMoney(price, cur)}`,
        `${I18N.margin.outProfit}: ${CL.formatMoney(profit, cur)}`,
        `${I18N.margin.outMargin}: ${CL.formatPercent(margin, 2)}`,
        `${I18N.margin.outMarkup}: ${CL.formatPercent(markup, 2)}`,
      ].join(' | ');

      if (syncUrl) CL.syncUrlState(getState());
    }

    const params = CL.readParams();
    if (params.has('cur')) currency.set(params.get('cur').toUpperCase(), true);
    if (params.has('mode')) elMode.value = params.get('mode');
    if (params.has('cost')) elCost.value = params.get('cost');
    if (params.has('price')) elPrice.value = params.get('price');
    if (params.has('tm')) elTargetMargin.value = params.get('tm');
    if (params.has('tmk')) elTargetMarkup.value = params.get('tmk');

    calculate(false);

    elMode.addEventListener('change', () => calculate(true));
    [elCost, elPrice, elTargetMargin, elTargetMarkup].forEach((input) => {
      input.addEventListener('input', () => calculate(true));
    });

    // Clickable reference table rows
    document.querySelectorAll('[data-apply-margin]').forEach((row) => {
      const activate = () => {
        const m = row.getAttribute('data-apply-margin');
        elMode.value = 'cost-margin';
        elTargetMargin.value = m;
        calculate(true);
        shell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      };
      row.addEventListener('click', activate);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });

    document.getElementById('margin-copy-result').addEventListener('click', () => {
      CL.copyText(lastSummary, I18N.copiedResult);
    });
    document.getElementById('margin-copy-link').addEventListener('click', () => {
      CL.copyText(CL.buildShareUrl(getState()), I18N.copiedLink);
    });
    document.getElementById('margin-reset').addEventListener('click', () => {
      currency.set(defaultCurrency, true);
      elMode.value = 'cost-price';
      elCost.value = '60';
      elPrice.value = '100';
      elTargetMargin.value = '40';
      elTargetMarkup.value = '66.67';
      calculate(true);
    });
  }

  /* ------------------------------------------------------------------------
     4. Freelance Hourly & Day Rate Calculator (B2B)
     ------------------------------------------------------------------------ */
  function initFreelance(shell) {
    const CL = window.CalcLedger;
    const I18N = CL.I18N;
    const defaultCurrency = shell.getAttribute('data-default-currency') || 'EUR';

    const elIncome = document.getElementById('fl-income');
    const elOverhead = document.getElementById('fl-overhead');
    const elTax = document.getElementById('fl-tax');
    const elWeeks = document.getElementById('fl-weeks');
    const elHoursWeek = document.getElementById('fl-hours-week');
    const elBillablePct = document.getElementById('fl-billable-pct');
    const elDayHours = document.getElementById('fl-day-hours');

    const defaults = {
      income: elIncome.value,
      overhead: elOverhead.value,
      tax: elTax.value,
      weeks: elWeeks.value,
      hoursWeek: elHoursWeek.value,
      billablePct: elBillablePct.value,
      dayHours: elDayHours.value,
    };

    const outHourly = document.getElementById('fl-out-hourly');
    const outDay = document.getElementById('fl-out-day');
    const outMonthly = document.getElementById('fl-out-monthly');
    const outAnnual = document.getElementById('fl-out-annual');
    const outHours = document.getElementById('fl-out-hours');
    const outDays = document.getElementById('fl-out-days');
    const barNet = document.getElementById('fl-bar-net');
    const barTax = document.getElementById('fl-bar-tax');
    const barOverhead = document.getElementById('fl-bar-overhead');
    const legNet = document.getElementById('fl-leg-net');
    const legTax = document.getElementById('fl-leg-tax');
    const legOverhead = document.getElementById('fl-leg-overhead');

    let lastSummary = '';
    const currency = bindCurrencySwitcher(shell, defaultCurrency, () => calculate(true));

    function getState() {
      return {
        cur: currency.get(),
        inc: elIncome.value,
        ovh: elOverhead.value,
        tax: elTax.value,
        wks: elWeeks.value,
        hpw: elHoursWeek.value,
        bill: elBillablePct.value,
        dh: elDayHours.value,
      };
    }

    function calculate(syncUrl) {
      const income = Math.max(0, CL.parseNum(elIncome.value, 0));
      const overhead = Math.max(0, CL.parseNum(elOverhead.value, 0));
      const taxPct = Math.max(0, Math.min(85, CL.parseNum(elTax.value, 0)));
      const weeks = Math.max(1, Math.min(52, CL.parseNum(elWeeks.value, 44)));
      const hoursWeek = Math.max(1, Math.min(100, CL.parseNum(elHoursWeek.value, 40)));
      const billablePct = Math.max(5, Math.min(100, CL.parseNum(elBillablePct.value, 70)));
      const dayHours = Math.max(1, Math.min(24, CL.parseNum(elDayHours.value, 8)));

      const preTaxProfitNeeded = income / (1 - taxPct / 100);
      const taxesTotal = preTaxProfitNeeded - income;
      const annualRev = preTaxProfitNeeded + overhead;
      const monthlyRev = annualRev / 12;

      const billableHours = weeks * hoursWeek * (billablePct / 100);
      const billableDays = billableHours / dayHours;
      const hourlyRate = billableHours > 0 ? annualRev / billableHours : 0;
      const dayRate = hourlyRate * dayHours;

      const cur = currency.get();
      outHourly.textContent = CL.formatMoney(hourlyRate, cur);
      outDay.textContent = CL.formatMoney(dayRate, cur);
      outMonthly.textContent = CL.formatMoney(monthlyRev, cur);
      outAnnual.textContent = CL.formatMoney(annualRev, cur);
      outHours.textContent = `${CL.formatNumber(Math.round(billableHours))} h`;
      outDays.textContent = `${CL.formatNumber(billableDays, 1)} d`;

      const pctNet = annualRev > 0 ? (income / annualRev) * 100 : 0;
      const pctTax = annualRev > 0 ? (taxesTotal / annualRev) * 100 : 0;
      const pctOvh = annualRev > 0 ? (overhead / annualRev) * 100 : 0;

      barNet.style.width = `${pctNet.toFixed(2)}%`;
      barTax.style.width = `${pctTax.toFixed(2)}%`;
      barOverhead.style.width = `${pctOvh.toFixed(2)}%`;
      legNet.textContent = CL.formatPercent(pctNet, 1);
      legTax.textContent = CL.formatPercent(pctTax, 1);
      legOverhead.textContent = CL.formatPercent(pctOvh, 1);

      lastSummary = [
        `${I18N.freelance.outHourly}: ${CL.formatMoney(hourlyRate, cur)}`,
        `${I18N.freelance.outDayRate}: ${CL.formatMoney(dayRate, cur)}`,
        `${I18N.freelance.outMonthlyRev}: ${CL.formatMoney(monthlyRev, cur)}`,
      ].join(' | ');

      if (syncUrl) CL.syncUrlState(getState());
    }

    const params = CL.readParams();
    if (params.has('cur')) currency.set(params.get('cur').toUpperCase(), true);
    if (params.has('inc')) elIncome.value = params.get('inc');
    if (params.has('ovh')) elOverhead.value = params.get('ovh');
    if (params.has('tax')) elTax.value = params.get('tax');
    if (params.has('wks')) elWeeks.value = params.get('wks');
    if (params.has('hpw')) elHoursWeek.value = params.get('hpw');
    if (params.has('bill')) elBillablePct.value = params.get('bill');
    if (params.has('dh')) elDayHours.value = params.get('dh');

    calculate(false);

    [elIncome, elOverhead, elTax, elWeeks, elHoursWeek, elBillablePct, elDayHours].forEach((input) => {
      input.addEventListener('input', () => calculate(true));
    });

    document.getElementById('fl-copy-result').addEventListener('click', () => {
      CL.copyText(lastSummary, I18N.copiedResult);
    });
    document.getElementById('fl-copy-link').addEventListener('click', () => {
      CL.copyText(CL.buildShareUrl(getState()), I18N.copiedLink);
    });
    document.getElementById('fl-reset').addEventListener('click', () => {
      currency.set(defaultCurrency, true);
      elIncome.value = defaults.income;
      elOverhead.value = defaults.overhead;
      elTax.value = defaults.tax;
      elWeeks.value = defaults.weeks;
      elHoursWeek.value = defaults.hoursWeek;
      elBillablePct.value = defaults.billablePct;
      elDayHours.value = defaults.dayHours;
      calculate(true);
    });
  }

  /* ------------------------------------------------------------------------
     5. Compound Interest & ROI Calculator + Responsive SVG Chart
     ------------------------------------------------------------------------ */
  function initCompound(shell) {
    const CL = window.CalcLedger;
    const I18N = CL.I18N;
    const defaultCurrency = shell.getAttribute('data-default-currency') || 'EUR';

    const elPrincipal = document.getElementById('cmp-principal');
    const elMonthly = document.getElementById('cmp-monthly');
    const elMonthlyWrap = document.getElementById('cmp-monthly-wrap');
    const elGoal = document.getElementById('cmp-goal');
    const elGoalWrap = document.getElementById('cmp-goal-wrap');
    const elRate = document.getElementById('cmp-rate');
    const elRateSlider = document.getElementById('cmp-rate-slider');
    const elYears = document.getElementById('cmp-years');
    const elYearsSlider = document.getElementById('cmp-years-slider');
    const elFreq = document.getElementById('cmp-freq');
    const elTax = document.getElementById('cmp-tax');
    const elInflation = document.getElementById('cmp-inflation');

    const defaults = {
      principal: elPrincipal.value,
      monthly: elMonthly.value,
      goal: elGoal ? elGoal.value : '500000',
      rate: elRate.value,
      years: elYears.value,
      freq: elFreq.value,
      tax: elTax.value,
      inflation: elInflation.value,
    };

    const elPrimaryLabel = document.getElementById('cmp-primary-label');
    const outFv = document.getElementById('cmp-out-fv');
    const outReal = document.getElementById('cmp-out-real');
    const outAfterTax = document.getElementById('cmp-out-after-tax');
    const outTax = document.getElementById('cmp-out-tax');
    const outContrib = document.getElementById('cmp-out-contrib');
    const outInterest = document.getElementById('cmp-out-interest');
    const outRoi = document.getElementById('cmp-out-roi');
    const outMult = document.getElementById('cmp-out-mult');
    const svgChart = document.getElementById('cmp-svg-chart');
    const tableBody = document.getElementById('cmp-table-body');

    let mode = 'growth'; // 'growth' | 'goal'
    let lastSummary = '';
    let lastRows = [];
    let lastCur = defaultCurrency;
    const currency = bindCurrencySwitcher(shell, defaultCurrency, () => calculate(true));

    function setMode(nextMode, sync) {
      mode = nextMode === 'goal' ? 'goal' : 'growth';
      shell.querySelectorAll('[data-cmp-mode]').forEach((btn) => {
        const active = btn.getAttribute('data-cmp-mode') === mode;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      if (elMonthlyWrap) elMonthlyWrap.hidden = mode === 'goal';
      if (elGoalWrap) elGoalWrap.hidden = mode !== 'goal';
      if (elPrimaryLabel) {
        elPrimaryLabel.textContent = mode === 'goal' ? I18N.compound.outRequiredMonthly : I18N.compound.outFutureValue;
      }
      calculate(sync);
    }

    function syncSlidersFromInputs() {
      if (elRateSlider) {
        const r = Math.max(0, Math.min(25, CL.parseNum(elRate.value, 0)));
        elRateSlider.value = String(r);
      }
      if (elYearsSlider) {
        const y = Math.max(1, Math.min(50, Math.round(CL.parseNum(elYears.value, 15))));
        elYearsSlider.value = String(y);
      }
    }

    function updatePills(taxVal, infVal, goalVal) {
      shell.querySelectorAll('[data-cmp-tax]').forEach((btn) => {
        const v = CL.parseNum(btn.getAttribute('data-cmp-tax'), -1);
        btn.classList.toggle('is-active', Math.abs(v - taxVal) < 0.01);
      });
      shell.querySelectorAll('[data-cmp-inf]').forEach((btn) => {
        const v = CL.parseNum(btn.getAttribute('data-cmp-inf'), -1);
        btn.classList.toggle('is-active', Math.abs(v - infVal) < 0.01);
      });
      shell.querySelectorAll('[data-cmp-goal]').forEach((btn) => {
        const v = CL.parseNum(btn.getAttribute('data-cmp-goal'), -1);
        btn.classList.toggle('is-active', Math.abs(v - goalVal) < 1);
      });
    }

    function getState() {
      return {
        cur: currency.get(),
        mode,
        p: elPrincipal.value,
        m: elMonthly.value,
        goal: elGoal ? elGoal.value : '',
        r: elRate.value,
        y: elYears.value,
        f: elFreq.value,
        tax: elTax.value,
        inf: elInflation.value,
      };
    }

    function renderSvgChart(rows, principal, cur) {
      const W = 760;
      const H = 300;
      const padL = 74;
      const padR = 20;
      const padT = 18;
      const padB = 36;
      const plotW = W - padL - padR;
      const plotH = H - padT - padB;

      const maxVal = Math.max(rows.length ? rows[rows.length - 1].endBalance : 100, 1);
      const yTicks = 4;
      const parts = [];

      for (let i = 0; i <= yTicks; i++) {
        const ratio = i / yTicks;
        const y = padT + plotH - ratio * plotH;
        const tickVal = maxVal * ratio;
        parts.push(
          `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="#E4E0D7" stroke-width="1" />`
        );
        parts.push(
          `<text x="${padL - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="#6B7A88" font-size="11" font-family="JetBrains Mono, monospace">${CL.formatCompactMoney(tickVal, cur)}</text>`
        );
      }

      const n = rows.length;
      const step = plotW / Math.max(n, 1);
      const barW = Math.max(4, Math.min(34, step * 0.68));
      const labelEvery = n > 25 ? 5 : n > 15 ? 3 : n > 10 ? 2 : 1;

      rows.forEach((row, idx) => {
        const x = padL + idx * step + (step - barW) / 2;
        const hPrincipal = (principal / maxVal) * plotH;
        const hContrib = (row.cumAdded / maxVal) * plotH;
        const hInterest = (Math.max(0, row.cumInterest) / maxVal) * plotH;

        const yPrincipal = padT + plotH - hPrincipal;
        const yContrib = yPrincipal - hContrib;
        const yInterest = yContrib - hInterest;

        const tip = `${I18N.compound.colYear} ${row.year}: ${CL.formatMoney(row.endBalance, cur)} (${I18N.compound.colReal}: ${CL.formatMoney(row.realEnd, cur)})`;

        parts.push(`<g>`);
        parts.push(`<title>${tip}</title>`);
        if (hPrincipal > 0.3) {
          parts.push(`<rect x="${x.toFixed(1)}" y="${yPrincipal.toFixed(1)}" width="${barW.toFixed(1)}" height="${hPrincipal.toFixed(1)}" fill="#1E4E79" />`);
        }
        if (hContrib > 0.3) {
          parts.push(`<rect x="${x.toFixed(1)}" y="${yContrib.toFixed(1)}" width="${barW.toFixed(1)}" height="${hContrib.toFixed(1)}" fill="#C2781F" />`);
        }
        if (hInterest > 0.3) {
          parts.push(`<rect x="${x.toFixed(1)}" y="${yInterest.toFixed(1)}" width="${barW.toFixed(1)}" height="${hInterest.toFixed(1)}" rx="2" fill="#0F5C48" />`);
        }
        parts.push(`</g>`);

        if (row.year === 1 || row.year === n || row.year % labelEvery === 0) {
          parts.push(
            `<text x="${(x + barW / 2).toFixed(1)}" y="${H - 12}" text-anchor="middle" fill="#4A5A6A" font-size="11" font-family="JetBrains Mono, monospace">${row.year}</text>`
          );
        }
      });

      svgChart.innerHTML = parts.join('');
    }

    function exportCsv() {
      if (!lastRows.length) return;
      const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
      const headers = [
        I18N.compound.colYear,
        `${I18N.compound.colStart} (${lastCur})`,
        `${I18N.compound.colAdded} (${lastCur})`,
        `${I18N.compound.colInterest} (${lastCur})`,
        `${I18N.compound.colEnd} (${lastCur})`,
        `${I18N.compound.colReal} (${lastCur})`,
        `${I18N.compound.colRoi} (%)`,
      ];
      const lines = [headers.map(esc).join(',')];
      lastRows.forEach((r) => {
        lines.push(
          [
            r.year,
            r.startBalance.toFixed(2),
            r.yearAdded.toFixed(2),
            r.yearInterest.toFixed(2),
            r.endBalance.toFixed(2),
            r.realEnd.toFixed(2),
            r.roi.toFixed(2),
          ]
            .map(esc)
            .join(',')
        );
      });
      const csvContent = `\uFEFF${lines.join('\r\n')}\r\n`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calcledger-compound-${lastCur.toLowerCase()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      CL.showToast(I18N.compound.downloadedCsv || 'CSV downloaded');
    }

    function calculate(syncUrl) {
      const principal = Math.max(0, CL.parseNum(elPrincipal.value, 0));
      const targetGoal = elGoal ? Math.max(0, CL.parseNum(elGoal.value, 0)) : 0;
      const annualRate = Math.max(0, Math.min(100, CL.parseNum(elRate.value, 0))) / 100;
      const years = Math.max(1, Math.min(50, Math.round(CL.parseNum(elYears.value, 10))));
      const freq = Math.max(1, parseInt(elFreq.value, 10) || 12);
      const taxPct = Math.max(0, Math.min(60, CL.parseNum(elTax.value, 0)));
      const infPct = Math.max(0, Math.min(30, CL.parseNum(elInflation.value, 0)));

      syncSlidersFromInputs();
      updatePills(taxPct, infPct, targetGoal);

      const effectiveAnnual = Math.pow(1 + annualRate / freq, freq) - 1;
      const monthlyGrowth = Math.pow(1 + effectiveAnnual, 1 / 12) - 1;
      const totalMonths = years * 12;

      let monthly = Math.max(0, CL.parseNum(elMonthly.value, 0));
      if (mode === 'goal') {
        const growthFactor = Math.pow(1 + monthlyGrowth, totalMonths);
        const principalEnd = principal * growthFactor;
        const shortfall = Math.max(0, targetGoal - principalEnd);
        if (monthlyGrowth > 1e-9) {
          monthly = (shortfall * monthlyGrowth) / (growthFactor - 1);
        } else {
          monthly = shortfall / totalMonths;
        }
      }

      let balance = principal;
      let cumAdded = 0;
      let cumInterest = 0;
      const rows = [];

      for (let y = 1; y <= years; y++) {
        const startBalance = balance;
        let yearAdded = 0;
        let yearInterest = 0;

        for (let m = 1; m <= 12; m++) {
          const interest = balance * monthlyGrowth;
          balance += interest + monthly;
          yearInterest += interest;
          yearAdded += monthly;
        }

        cumAdded += yearAdded;
        cumInterest += yearInterest;
        const totalIn = principal + cumAdded;
        const roi = totalIn > 0 ? (cumInterest / totalIn) * 100 : 0;
        const afterTaxEnd = balance - Math.max(0, cumInterest) * (taxPct / 100);
        const realEnd = afterTaxEnd / Math.pow(1 + infPct / 100, y);

        rows.push({
          year: y,
          startBalance,
          yearAdded,
          yearInterest,
          endBalance: balance,
          realEnd,
          cumAdded,
          cumInterest,
          roi,
        });
      }

      const totalContrib = principal + cumAdded;
      const taxPaid = Math.max(0, cumInterest) * (taxPct / 100);
      const afterTaxFv = balance - taxPaid;
      const realFv = afterTaxFv / Math.pow(1 + infPct / 100, years);
      const totalRoi = totalContrib > 0 ? (cumInterest / totalContrib) * 100 : 0;
      const multiple = totalContrib > 0 ? balance / totalContrib : 0;
      const cur = currency.get();

      lastRows = rows;
      lastCur = cur;

      outFv.textContent = mode === 'goal' ? CL.formatMoney(monthly, cur) : CL.formatMoney(balance, cur);
      if (outReal) outReal.textContent = CL.formatMoney(realFv, cur);
      if (outAfterTax) outAfterTax.textContent = CL.formatMoney(afterTaxFv, cur);
      if (outTax) outTax.textContent = CL.formatMoney(taxPaid, cur);
      outContrib.textContent = CL.formatMoney(totalContrib, cur);
      outInterest.textContent = CL.formatMoney(cumInterest, cur);
      outRoi.textContent = CL.formatPercent(totalRoi, 1);
      outMult.textContent = `${multiple.toFixed(2)}×`;

      renderSvgChart(rows, principal, cur);

      tableBody.innerHTML = rows
        .map(
          (r) => `<tr>
            <td class="num"><strong>${r.year}</strong></td>
            <td class="num">${CL.formatMoney(r.startBalance, cur)}</td>
            <td class="num">${CL.formatMoney(r.yearAdded, cur)}</td>
            <td class="num">${CL.formatMoney(r.yearInterest, cur)}</td>
            <td class="num"><strong>${CL.formatMoney(r.endBalance, cur)}</strong></td>
            <td class="num">${CL.formatMoney(r.realEnd, cur)}</td>
            <td class="num">${CL.formatPercent(r.roi, 1)}</td>
          </tr>`
        )
        .join('');

      lastSummary =
        mode === 'goal'
          ? [
              `${I18N.compound.outRequiredMonthly}: ${CL.formatMoney(monthly, cur)}`,
              `${I18N.compound.outFutureValue} (${years}y): ${CL.formatMoney(balance, cur)}`,
              `${I18N.compound.outRealValue}: ${CL.formatMoney(realFv, cur)}`,
            ].join(' | ')
          : [
              `${I18N.compound.outFutureValue} (${years}y): ${CL.formatMoney(balance, cur)}`,
              `${I18N.compound.outAfterTax}: ${CL.formatMoney(afterTaxFv, cur)}`,
              `${I18N.compound.outRealValue}: ${CL.formatMoney(realFv, cur)}`,
              `${I18N.compound.outTotalContrib}: ${CL.formatMoney(totalContrib, cur)}`,
              `${I18N.compound.outTotalRoi}: ${CL.formatPercent(totalRoi, 1)}`,
            ].join(' | ');

      if (syncUrl) CL.syncUrlState(getState());
    }

    const params = CL.readParams();
    if (params.has('cur')) currency.set(params.get('cur').toUpperCase(), true);
    if (params.has('p')) elPrincipal.value = params.get('p');
    if (params.has('m')) elMonthly.value = params.get('m');
    if (params.has('goal') && elGoal) elGoal.value = params.get('goal');
    if (params.has('r')) elRate.value = params.get('r');
    if (params.has('y')) elYears.value = params.get('y');
    if (params.has('f')) elFreq.value = params.get('f');
    if (params.has('tax')) elTax.value = params.get('tax');
    if (params.has('inf')) elInflation.value = params.get('inf');

    setMode(params.get('mode') === 'goal' ? 'goal' : 'growth', false);

    shell.querySelectorAll('[data-cmp-mode]').forEach((btn) => {
      btn.addEventListener('click', () => setMode(btn.getAttribute('data-cmp-mode'), true));
    });

    [elPrincipal, elMonthly, elGoal, elRate, elYears, elTax, elInflation]
      .filter(Boolean)
      .forEach((input) => {
        input.addEventListener('input', () => calculate(true));
      });
    elFreq.addEventListener('change', () => calculate(true));

    if (elRateSlider) {
      elRateSlider.addEventListener('input', () => {
        elRate.value = elRateSlider.value;
        calculate(true);
      });
    }
    if (elYearsSlider) {
      elYearsSlider.addEventListener('input', () => {
        elYears.value = elYearsSlider.value;
        calculate(true);
      });
    }

    shell.querySelectorAll('[data-cmp-goal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (elGoal) elGoal.value = btn.getAttribute('data-cmp-goal');
        calculate(true);
      });
    });

    shell.querySelectorAll('[data-cmp-tax]').forEach((btn) => {
      btn.addEventListener('click', () => {
        elTax.value = btn.getAttribute('data-cmp-tax');
        calculate(true);
      });
    });

    shell.querySelectorAll('[data-cmp-inf]').forEach((btn) => {
      btn.addEventListener('click', () => {
        elInflation.value = btn.getAttribute('data-cmp-inf');
        calculate(true);
      });
    });

    document.getElementById('cmp-copy-result').addEventListener('click', () => {
      CL.copyText(lastSummary, I18N.copiedResult);
    });
    const btnCsv = document.getElementById('cmp-download-csv');
    if (btnCsv) {
      btnCsv.addEventListener('click', exportCsv);
    }
    document.getElementById('cmp-copy-link').addEventListener('click', () => {
      CL.copyText(CL.buildShareUrl(getState()), I18N.copiedLink);
    });
    document.getElementById('cmp-reset').addEventListener('click', () => {
      currency.set(defaultCurrency, true);
      elPrincipal.value = defaults.principal;
      elMonthly.value = defaults.monthly;
      if (elGoal) elGoal.value = defaults.goal;
      elRate.value = defaults.rate;
      elYears.value = defaults.years;
      elFreq.value = defaults.freq;
      elTax.value = defaults.tax;
      elInflation.value = defaults.inflation;
      setMode('growth', true);
    });
  }

  /* ------------------------------------------------------------------------
     6. PayPal & Stripe Payment Fee Calculator (Forward & Reverse)
     ------------------------------------------------------------------------ */
  function initPayment(shell) {
    const CL = window.CalcLedger;
    const I18N = CL.I18N;
    const PRESETS = window.CALCLEDGER_PAY_PRESETS || {};
    const defaultCurrency = shell.getAttribute('data-default-currency') || 'EUR';
    const defaultPreset = shell.getAttribute('data-default-preset') || '';

    const elPreset = document.getElementById('pay-preset');
    const elAmount = document.getElementById('pay-amount');
    const elAmountLabel = document.getElementById('pay-amount-label');
    const elPct = document.getElementById('pay-pct');
    const elFixed = document.getElementById('pay-fixed');
    const elFx = document.getElementById('pay-fx');
    const elPrimaryLabel = document.getElementById('pay-primary-label');

    const outPrimary = document.getElementById('pay-out-primary');
    const outGross = document.getElementById('pay-out-gross');
    const outFee = document.getElementById('pay-out-fee');
    const outNet = document.getElementById('pay-out-net');
    const outEff = document.getElementById('pay-out-eff');
    const barNet = document.getElementById('pay-bar-net');
    const barFee = document.getElementById('pay-bar-fee');
    const legNet = document.getElementById('pay-leg-net');
    const legFee = document.getElementById('pay-leg-fee');

    const initial = {
      preset: elPreset.value,
      amount: elAmount.value,
      pct: elPct.value,
      fixed: elFixed.value,
      fx: elFx.value,
    };

    let mode = 'forward';
    let lastSummary = '';
    const currency = bindCurrencySwitcher(shell, defaultCurrency, () => calculate(true));

    function setMode(nextMode, sync) {
      mode = nextMode === 'reverse' ? 'reverse' : 'forward';
      shell.querySelectorAll('[data-pay-mode]').forEach((btn) => {
        const active = btn.getAttribute('data-pay-mode') === mode;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      elAmountLabel.textContent = mode === 'forward' ? I18N.payment.amountLabelForward : I18N.payment.amountLabelReverse;
      elPrimaryLabel.textContent = mode === 'forward' ? I18N.payment.outPrimaryForward : I18N.payment.outPrimaryReverse;
      calculate(sync);
    }

    function getState() {
      return {
        cur: currency.get(),
        mode,
        preset: elPreset.value,
        amt: elAmount.value,
        pct: elPct.value,
        fix: elFixed.value,
        fx: elFx.value,
      };
    }

    function calculate(syncUrl) {
      const amount = Math.max(0, CL.parseNum(elAmount.value, 0));
      const pct = Math.max(0, Math.min(50, CL.parseNum(elPct.value, 0)));
      const fixed = Math.max(0, CL.parseNum(elFixed.value, 0));
      const fx = Math.max(0, Math.min(25, CL.parseNum(elFx.value, 0)));
      const totalRate = (pct + fx) / 100;

      let gross = 0;
      let net = 0;
      let totalFee = 0;

      if (mode === 'forward') {
        gross = amount;
        totalFee = gross > 0 ? gross * totalRate + fixed : 0;
        net = Math.max(0, gross - totalFee);
      } else {
        net = amount;
        if (net > 0 && totalRate < 0.99) {
          gross = (net + fixed) / (1 - totalRate);
          totalFee = gross - net;
        }
      }

      const effPct = gross > 0 ? (totalFee / gross) * 100 : 0;
      const keepPct = gross > 0 ? Math.max(0, 100 - effPct) : 100;
      const cur = currency.get();

      outPrimary.textContent = CL.formatMoney(mode === 'forward' ? net : gross, cur);
      outGross.textContent = CL.formatMoney(gross, cur);
      outFee.textContent = CL.formatMoney(totalFee, cur);
      outNet.textContent = CL.formatMoney(net, cur);
      outEff.textContent = CL.formatPercent(effPct, 2);

      barNet.style.width = `${keepPct.toFixed(2)}%`;
      barFee.style.width = `${Math.min(100, effPct).toFixed(2)}%`;
      legNet.textContent = CL.formatPercent(keepPct, 1);
      legFee.textContent = CL.formatPercent(effPct, 1);

      lastSummary = [
        `${I18N.payment.outGross}: ${CL.formatMoney(gross, cur)}`,
        `${I18N.payment.outTotalFee}: ${CL.formatMoney(totalFee, cur)} (${CL.formatPercent(effPct, 2)})`,
        `${I18N.payment.outNet}: ${CL.formatMoney(net, cur)}`,
      ].join(' | ');

      if (syncUrl) CL.syncUrlState(getState());
    }

    const params = CL.readParams();
    if (params.has('cur')) currency.set(params.get('cur').toUpperCase(), true);
    if (params.has('preset') && PRESETS[params.get('preset')]) elPreset.value = params.get('preset');
    if (params.has('amt')) elAmount.value = params.get('amt');
    if (params.has('pct')) elPct.value = params.get('pct');
    if (params.has('fix')) elFixed.value = params.get('fix');
    if (params.has('fx')) elFx.value = params.get('fx');
    setMode(params.get('mode') === 'reverse' ? 'reverse' : 'forward', false);

    shell.querySelectorAll('[data-pay-mode]').forEach((btn) => {
      btn.addEventListener('click', () => setMode(btn.getAttribute('data-pay-mode'), true));
    });

    elPreset.addEventListener('change', () => {
      const p = PRESETS[elPreset.value];
      if (!p) return;
      elPct.value = p.pct;
      elFixed.value = p.fixed;
      elFx.value = p.fxPct;
      calculate(true);
    });

    [elAmount, elPct, elFixed, elFx].forEach((input) => {
      input.addEventListener('input', () => calculate(true));
    });

    document.getElementById('pay-copy-result').addEventListener('click', () => {
      CL.copyText(lastSummary, I18N.copiedResult);
    });
    document.getElementById('pay-copy-link').addEventListener('click', () => {
      CL.copyText(CL.buildShareUrl(getState()), I18N.copiedLink);
    });
    document.getElementById('pay-reset').addEventListener('click', () => {
      currency.set(defaultCurrency, true);
      elPreset.value = defaultPreset || initial.preset;
      elAmount.value = initial.amount;
      elPct.value = initial.pct;
      elFixed.value = initial.fixed;
      elFx.value = initial.fx;
      setMode('forward', true);
    });
  }

  /* ------------------------------------------------------------------------
     7. ROAS <-> ACOS & Break-Even Ads Calculator
     ------------------------------------------------------------------------ */
  function initRoas(shell) {
    const CL = window.CalcLedger;
    const I18N = CL.I18N;
    const defaultCurrency = shell.getAttribute('data-default-currency') || 'EUR';

    const elSpend = document.getElementById('roas-spend');
    const elRev = document.getElementById('roas-rev');
    const elMargin = document.getElementById('roas-margin');

    const heroBox = document.getElementById('roas-hero-box');
    const outRoas = document.getElementById('roas-out-roas');
    const outAcos = document.getElementById('roas-out-acos');
    const outBeRoas = document.getElementById('roas-out-be-roas');
    const outBeAcos = document.getElementById('roas-out-be-acos');
    const outProfit = document.getElementById('roas-out-profit');
    const outNetMargin = document.getElementById('roas-out-net-margin');
    const barCogs = document.getElementById('roas-bar-cogs');
    const barAds = document.getElementById('roas-bar-ads');
    const barProfit = document.getElementById('roas-bar-profit');
    const elLegend = document.getElementById('roas-legend');

    let lastSummary = '';
    const currency = bindCurrencySwitcher(shell, defaultCurrency, () => calculate(true));

    function getState() {
      return {
        cur: currency.get(),
        spend: elSpend.value,
        rev: elRev.value,
        margin: elMargin.value,
      };
    }

    function calculate(syncUrl) {
      const spend = Math.max(0, CL.parseNum(elSpend.value, 0));
      const rev = Math.max(0, CL.parseNum(elRev.value, 0));
      const preAdMargin = Math.max(1, Math.min(100, CL.parseNum(elMargin.value, 40)));

      const roas = spend > 0 ? rev / spend : 0;
      const acos = rev > 0 ? (spend / rev) * 100 : 0;
      const beRoas = 100 / preAdMargin;
      const beAcos = preAdMargin;

      const grossBeforeAds = rev * (preAdMargin / 100);
      const cogs = rev - grossBeforeAds;
      const netProfit = grossBeforeAds - spend;
      const netMargin = rev > 0 ? (netProfit / rev) * 100 : 0;

      const cur = currency.get();
      heroBox.classList.toggle('is-loss', netProfit < 0);
      outRoas.textContent = `${roas.toFixed(2)}×`;
      outAcos.textContent = CL.formatPercent(acos, 2);
      outBeRoas.textContent = `${beRoas.toFixed(2)}×`;
      outBeAcos.textContent = CL.formatPercent(beAcos, 2);
      outProfit.textContent = CL.formatMoney(netProfit, cur);
      outNetMargin.textContent = CL.formatPercent(netMargin, 2);

      const denom = Math.max(rev, cogs + spend + Math.max(0, netProfit), 0.01);
      barCogs.style.width = `${((cogs / denom) * 100).toFixed(2)}%`;
      barAds.style.width = `${((spend / denom) * 100).toFixed(2)}%`;
      barProfit.style.width = `${((Math.max(0, netProfit) / denom) * 100).toFixed(2)}%`;

      const cogsPct = rev > 0 ? (cogs / rev) * 100 : 0;
      elLegend.innerHTML = [
        `<span><i class="dot seg-navy"></i>${I18N.roas.barCogs} <strong class="num">${CL.formatPercent(cogsPct, 1)}</strong></span>`,
        `<span><i class="dot seg-terra"></i>${I18N.roas.barAds} <strong class="num">${CL.formatPercent(acos, 1)}</strong></span>`,
        `<span><i class="dot ${netProfit >= 0 ? 'seg-emerald' : 'seg-terra'}"></i>${netProfit >= 0 ? I18N.roas.barProfit : I18N.roas.barLoss} <strong class="num">${CL.formatPercent(netMargin, 1)}</strong></span>`,
      ].join('');

      document.querySelectorAll('[data-apply-roas]').forEach((row) => {
        const rowR = CL.parseNum(row.getAttribute('data-apply-roas'), -1);
        row.classList.toggle('is-selected', Math.abs(rowR - roas) < 0.05);
      });

      lastSummary = [
        `ROAS: ${roas.toFixed(2)}×`,
        `ACOS: ${CL.formatPercent(acos, 2)}`,
        `${I18N.roas.outBeRoas}: ${beRoas.toFixed(2)}×`,
        `${I18N.roas.outNetProfit}: ${CL.formatMoney(netProfit, cur)}`,
      ].join(' | ');

      if (syncUrl) CL.syncUrlState(getState());
    }

    const params = CL.readParams();
    if (params.has('cur')) currency.set(params.get('cur').toUpperCase(), true);
    if (params.has('spend')) elSpend.value = params.get('spend');
    if (params.has('rev')) elRev.value = params.get('rev');
    if (params.has('margin')) elMargin.value = params.get('margin');

    calculate(false);

    [elSpend, elRev, elMargin].forEach((input) => {
      input.addEventListener('input', () => calculate(true));
    });

    document.querySelectorAll('[data-apply-roas]').forEach((row) => {
      const activate = () => {
        const targetRoas = CL.parseNum(row.getAttribute('data-apply-roas'), 4);
        const spend = Math.max(100, CL.parseNum(elSpend.value, 1000));
        elSpend.value = spend;
        elRev.value = (spend * targetRoas).toFixed(2).replace(/\.00$/, '');
        calculate(true);
        shell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      };
      row.addEventListener('click', activate);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });

    document.getElementById('roas-copy-result').addEventListener('click', () => {
      CL.copyText(lastSummary, I18N.copiedResult);
    });
    document.getElementById('roas-copy-link').addEventListener('click', () => {
      CL.copyText(CL.buildShareUrl(getState()), I18N.copiedLink);
    });
    document.getElementById('roas-reset').addEventListener('click', () => {
      currency.set(defaultCurrency, true);
      elSpend.value = '1000';
      elRev.value = '4000';
      elMargin.value = '40';
      calculate(true);
    });
  }

  /* ------------------------------------------------------------------------
     8. 1-on-1 Platform Comparison Calculator (Marketplace & Payment)
     ------------------------------------------------------------------------ */
  function initCompare(shell) {
    const CL = window.CalcLedger;
    const I18N = CL.I18N;
    const CFG = window.CALCLEDGER_COMPARE || {};
    const isPayment = CFG.kind === 'payment';
    const defaultCurrency = shell.getAttribute('data-default-currency') || 'EUR';
    const nameA = (CFG.sideA && CFG.sideA.name) || 'Platform A';
    const nameB = (CFG.sideB && CFG.sideB.name) || 'Platform B';

    const winnerLabel = document.getElementById('vs-winner-label');
    const winnerDelta = document.getElementById('vs-winner-delta');
    const winnerSub = document.getElementById('vs-winner-sub');
    const cardA = document.getElementById('vs-card-a');
    const cardB = document.getElementById('vs-card-b');
    const badgeA = document.getElementById('vs-badge-a');
    const badgeB = document.getElementById('vs-badge-b');
    const outA = [1, 2, 3, 4, 5].map((i) => document.getElementById(`vs-a-m${i}`));
    const outB = [1, 2, 3, 4, 5].map((i) => document.getElementById(`vs-b-m${i}`));

    const allInputs = Array.from(shell.querySelectorAll('.calc-inputs input'));
    const initialSnapshot = allInputs.map((el) => ({
      el,
      type: el.type,
      value: el.type === 'checkbox' ? el.checked : el.value,
    }));

    let lastSummary = '';
    const currency = bindCurrencySwitcher(shell, defaultCurrency, () => calculate(true));

    function readVal(id, fallback = 0) {
      const el = document.getElementById(id);
      return el ? CL.parseNum(el.value, fallback) : fallback;
    }

    function setWinnerUI(monthlyDiff, winnerName, cur) {
      const absMonthly = Math.abs(monthlyDiff);
      const absYearly = absMonthly * 12;
      if (absMonthly < 0.01) {
        winnerLabel.textContent = `${nameA} vs ${nameB}`;
        winnerDelta.textContent = CL.formatMoney(0, cur);
        if (winnerSub) winnerSub.textContent = I18N.compare.tieText;
        cardA.classList.remove('is-winner');
        cardB.classList.remove('is-winner');
        badgeA.hidden = true;
        badgeB.hidden = true;
      } else {
        const aWins = monthlyDiff > 0;
        winnerLabel.textContent = `${winnerName} · ${I18N.compare.winnerBadge}`;
        winnerDelta.textContent = `+${CL.formatMoney(absMonthly, cur)}`;
        if (winnerSub) {
          winnerSub.textContent = I18N.compare.winnerSaves
            .replace('{winner}', winnerName)
            .replace('{monthly}', CL.formatMoney(absMonthly, cur))
            .replace('{yearly}', CL.formatMoney(absYearly, cur));
        }
        cardA.classList.toggle('is-winner', aWins);
        cardB.classList.toggle('is-winner', !aWins);
        badgeA.hidden = !aWins;
        badgeB.hidden = aWins;
      }
    }

    function getState() {
      const state = { cur: currency.get() };
      allInputs.forEach((el) => {
        if (!el.id) return;
        const shortKey = el.id.replace(/^vs-/, '');
        state[shortKey] = el.type === 'checkbox' ? (el.checked ? '1' : '0') : el.value;
      });
      return state;
    }

    function calculate(syncUrl) {
      const cur = currency.get();

      if (isPayment) {
        const amount = Math.max(0, readVal('vs-amount', 100));
        const txCount = Math.max(1, Math.round(readVal('vs-orders', 100)));
        const fx = Math.max(0, Math.min(20, readVal('vs-fx', 0)));
        const aPct = Math.max(0, Math.min(50, readVal('vs-a-pct', 2.99)));
        const aFix = Math.max(0, readVal('vs-a-fix', 0.35));
        const bPct = Math.max(0, Math.min(50, readVal('vs-b-pct', 1.5)));
        const bFix = Math.max(0, readVal('vs-b-fix', 0.25));

        const evalPay = (pct, fix) => {
          const fee = amount > 0 ? amount * ((pct + fx) / 100) + fix : 0;
          const net = Math.max(0, amount - fee);
          const eff = amount > 0 ? (fee / amount) * 100 : 0;
          return { net, fee, eff, monthlyFees: fee * txCount, yearlyFees: fee * txCount * 12 };
        };

        const a = evalPay(aPct, aFix);
        const b = evalPay(bPct, bFix);

        outA[0].textContent = CL.formatMoney(a.net, cur);
        outA[1].textContent = CL.formatMoney(a.fee, cur);
        outA[2].textContent = CL.formatPercent(a.eff, 2);
        outA[3].textContent = CL.formatMoney(a.monthlyFees, cur);
        outA[4].textContent = CL.formatMoney(a.yearlyFees, cur);

        outB[0].textContent = CL.formatMoney(b.net, cur);
        outB[1].textContent = CL.formatMoney(b.fee, cur);
        outB[2].textContent = CL.formatPercent(b.eff, 2);
        outB[3].textContent = CL.formatMoney(b.monthlyFees, cur);
        outB[4].textContent = CL.formatMoney(b.yearlyFees, cur);

        // Positive diff => A saves more (lower fees); negative => B saves more
        const diff = b.monthlyFees - a.monthlyFees;
        const winnerName = diff >= 0 ? nameA : nameB;
        setWinnerUI(diff, winnerName, cur);

        lastSummary = `${nameA}: ${CL.formatMoney(a.fee, cur)}/tx (${CL.formatMoney(a.yearlyFees, cur)}/yr) vs ${nameB}: ${CL.formatMoney(b.fee, cur)}/tx (${CL.formatMoney(b.yearlyFees, cur)}/yr)`;
      } else {
        const price = Math.max(0, readVal('vs-price', 0));
        const cogs = Math.max(0, readVal('vs-cogs', 0));
        const ship = Math.max(0, readVal('vs-ship', 0));
        const acos = Math.max(0, Math.min(100, readVal('vs-acos', 0)));
        const returnsPct = Math.max(0, Math.min(60, readVal('vs-returns', 0)));
        const orders = Math.max(1, Math.round(readVal('vs-orders', 100)));
        const vatCheck = document.getElementById('vs-vat-on');
        const vatWrap = document.getElementById('vs-vat-wrap');
        const vatOn = vatCheck ? vatCheck.checked : false;
        const vatRate = Math.max(0, Math.min(100, readVal('vs-vat-rate', 0)));
        if (vatWrap) vatWrap.hidden = !vatOn;

        const vatFactor = vatOn && vatRate > 0 ? (vatRate / 100) / (1 + vatRate / 100) : 0;
        const vatAmt = price * vatFactor;
        const adCost = price * (acos / 100);
        const r = returnsPct / 100;

        const evalSide = (commPct, payPct, fixFee) => {
          const fees = price * ((commPct + payPct) / 100) + fixFee;
          const singleNet = price - vatAmt - fees - adCost - cogs - ship;
          const expectedNet = (1 - r) * singleNet - r * (ship + adCost + fixFee);
          const margin = price > 0 ? (expectedNet / price) * 100 : 0;
          const profitBeforeAds = (1 - r) * (price - vatAmt - fees - cogs - ship) - r * (ship + fixFee);
          const beAcos = price > 0 ? Math.max(0, (profitBeforeAds / price) * 100) : 0;
          return { fees, expectedNet, margin, beAcos, monthly: expectedNet * orders };
        };

        const a = evalSide(readVal('vs-a-comm', 10), readVal('vs-a-pay', 0), readVal('vs-a-fix', 0));
        const b = evalSide(readVal('vs-b-comm', 15), readVal('vs-b-pay', 0), readVal('vs-b-fix', 0));

        const paintSide = (outs, res) => {
          outs[0].textContent = CL.formatMoney(res.expectedNet, cur);
          outs[0].classList.toggle('is-negative', res.expectedNet < 0);
          outs[1].textContent = CL.formatPercent(res.margin, 1);
          outs[1].classList.toggle('is-negative', res.margin < 0);
          outs[2].textContent = CL.formatMoney(res.fees, cur);
          outs[3].textContent = CL.formatPercent(res.beAcos, 1);
          outs[4].textContent = CL.formatMoney(res.monthly, cur);
          outs[4].classList.toggle('is-negative', res.monthly < 0);
        };

        paintSide(outA, a);
        paintSide(outB, b);

        const diff = a.monthly - b.monthly;
        const winnerName = diff >= 0 ? nameA : nameB;
        setWinnerUI(diff, winnerName, cur);

        lastSummary = `${nameA}: ${CL.formatMoney(a.expectedNet, cur)}/order (${CL.formatMoney(a.monthly, cur)}/mo) vs ${nameB}: ${CL.formatMoney(b.expectedNet, cur)}/order (${CL.formatMoney(b.monthly, cur)}/mo)`;
      }

      if (syncUrl) CL.syncUrlState(getState());
    }

    const params = CL.readParams();
    if (params.has('cur')) currency.set(params.get('cur').toUpperCase(), true);
    allInputs.forEach((el) => {
      if (!el.id) return;
      const shortKey = el.id.replace(/^vs-/, '');
      if (params.has(shortKey)) {
        if (el.type === 'checkbox') el.checked = params.get(shortKey) === '1';
        else el.value = params.get(shortKey);
      }
    });

    calculate(false);

    allInputs.forEach((el) => {
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => calculate(true));
    });

    document.getElementById('vs-copy-result').addEventListener('click', () => {
      CL.copyText(lastSummary, I18N.copiedResult);
    });
    document.getElementById('vs-copy-link').addEventListener('click', () => {
      CL.copyText(CL.buildShareUrl(getState()), I18N.copiedLink);
    });
    document.getElementById('vs-reset').addEventListener('click', () => {
      currency.set(defaultCurrency, true);
      initialSnapshot.forEach((snap) => {
        if (snap.type === 'checkbox') snap.el.checked = snap.value;
        else snap.el.value = snap.value;
      });
      calculate(true);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const shell = document.querySelector('[data-calc]');
    if (!shell) return;
    const type = shell.getAttribute('data-calc');
    if (type === 'vat') initVat(shell);
    else if (type === 'marketplace') initMarketplace(shell);
    else if (type === 'payment') initPayment(shell);
    else if (type === 'compare') initCompare(shell);
    else if (type === 'roas') initRoas(shell);
    else if (type === 'margin') initMargin(shell);
    else if (type === 'freelance') initFreelance(shell);
    else if (type === 'compound') initCompound(shell);
  });
})();
