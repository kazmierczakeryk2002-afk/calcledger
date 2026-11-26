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

  /* ------------------------------------------------------------------------
     9. Loan, Mortgage & Early Payoff Calculator + SVG Chart + CSV
     ------------------------------------------------------------------------ */
  function initLoan(shell) {
    const CL = window.CalcLedger;
    const I18N = CL.I18N;
    const defaultCurrency = shell.getAttribute('data-default-currency') || 'EUR';

    const elAmount = document.getElementById('loan-amount');
    const elRate = document.getElementById('loan-rate');
    const elRateSlider = document.getElementById('loan-rate-slider');
    const elYears = document.getElementById('loan-years');
    const elYearsSlider = document.getElementById('loan-years-slider');
    const elExtra = document.getElementById('loan-extra');
    const elLump = document.getElementById('loan-lump');

    const defaults = {
      amount: elAmount.value,
      rate: elRate.value,
      years: elYears.value,
      extra: elExtra.value,
      lump: elLump.value,
    };

    const outMonthly = document.getElementById('loan-out-monthly');
    const outSaved = document.getElementById('loan-out-saved');
    const outTimeSaved = document.getElementById('loan-out-time-saved');
    const outPayoff = document.getElementById('loan-out-payoff');
    const outInterest = document.getElementById('loan-out-interest');
    const outTotal = document.getElementById('loan-out-total');
    const outBaseInt = document.getElementById('loan-out-base-int');
    const outMonthlyTotal = document.getElementById('loan-out-monthly-total');
    const barPrincipal = document.getElementById('loan-bar-principal');
    const barInterest = document.getElementById('loan-bar-interest');
    const barSaved = document.getElementById('loan-bar-saved');
    const legPrincipal = document.getElementById('loan-leg-principal');
    const legInterest = document.getElementById('loan-leg-interest');
    const legSaved = document.getElementById('loan-leg-saved');
    const svgChart = document.getElementById('loan-svg-chart');
    const tableBody = document.getElementById('loan-table-body');

    let lastSummary = '';
    let lastRows = [];
    let lastCur = defaultCurrency;
    const currency = bindCurrencySwitcher(shell, defaultCurrency, () => calculate(true));

    function fmtDuration(totalMonths) {
      const m = Math.max(0, Math.round(totalMonths));
      if (m === 0) return I18N.loan.noSavings || '0 mos';
      const yrs = Math.floor(m / 12);
      const rem = m % 12;
      const yUnit = I18N.loan.unitYears || 'yrs';
      const mUnit = I18N.loan.unitMonths || 'mos';
      if (yrs > 0 && rem > 0) return `${yrs} ${yUnit} ${rem} ${mUnit}`;
      if (yrs > 0) return `${yrs} ${yUnit}`;
      return `${rem} ${mUnit}`;
    }

    function simulateSchedule(principal, monthlyRate, basePayment, extraMonthly, lumpSum, maxMonths) {
      let balance = Math.max(0, principal);
      let totalInterest = 0;
      let months = 0;
      const yearly = [];

      let yrPaid = 0;
      let yrPrincipal = 0;
      let yrInterest = 0;

      if (lumpSum > 0 && balance > 0) {
        const appliedLump = Math.min(balance, lumpSum);
        balance -= appliedLump;
        yrPaid += appliedLump;
        yrPrincipal += appliedLump;
      }

      while (balance > 0.01 && months < maxMonths + 12) {
        months++;
        const interest = balance * monthlyRate;
        const scheduledPrincipal = Math.max(0, basePayment - interest);
        let principalPaid = scheduledPrincipal + extraMonthly;
        if (principalPaid > balance) {
          principalPaid = balance;
        }
        const payment = interest + principalPaid;
        balance = Math.max(0, balance - principalPaid);
        totalInterest += interest;

        yrPaid += payment;
        yrPrincipal += principalPaid;
        yrInterest += interest;

        if (months % 12 === 0 || balance <= 0.01) {
          yearly.push({
            year: Math.ceil(months / 12),
            paid: yrPaid,
            principal: yrPrincipal,
            interest: yrInterest,
            balance,
          });
          yrPaid = 0;
          yrPrincipal = 0;
          yrInterest = 0;
        }
      }

      if (yearly.length === 0) {
        yearly.push({ year: 1, paid: yrPaid, principal: yrPrincipal, interest: 0, balance: 0 });
      }

      return { months, totalInterest, yearly };
    }

    function renderSvgChart(stdYearly, extraYearly, principal, cur) {
      const W = 760;
      const H = 280;
      const padL = 74;
      const padR = 20;
      const padT = 18;
      const padB = 34;
      const plotW = W - padL - padR;
      const plotH = H - padT - padB;
      const maxVal = Math.max(principal, 1);
      const totalYears = Math.max(stdYearly.length, 1);
      const parts = [];

      for (let i = 0; i <= 4; i++) {
        const ratio = i / 4;
        const y = padT + plotH - ratio * plotH;
        const tickVal = maxVal * ratio;
        parts.push(`<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="#E4E0D7" stroke-width="1" />`);
        parts.push(`<text x="${padL - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="#6B7A88" font-size="11" font-family="JetBrains Mono, monospace">${CL.formatCompactMoney(tickVal, cur)}</text>`);
      }

      const xForYear = (yIdx) => padL + (yIdx / totalYears) * plotW;
      const yForVal = (val) => padT + plotH - (Math.max(0, val) / maxVal) * plotH;

      const stdPts = [`${xForYear(0).toFixed(1)},${yForVal(principal).toFixed(1)}`];
      stdYearly.forEach((r) => {
        stdPts.push(`${xForYear(r.year).toFixed(1)},${yForVal(r.balance).toFixed(1)}`);
      });

      const extPts = [`${xForYear(0).toFixed(1)},${yForVal(principal).toFixed(1)}`];
      extraYearly.forEach((r) => {
        extPts.push(`${xForYear(r.year).toFixed(1)},${yForVal(r.balance).toFixed(1)}`);
      });

      const extArea = `${extPts.join(' ')} ${xForYear(extraYearly[extraYearly.length - 1].year).toFixed(1)},${(padT + plotH).toFixed(1)} ${xForYear(0).toFixed(1)},${(padT + plotH).toFixed(1)}`;

      parts.push(`<polygon points="${extArea}" fill="rgba(15, 92, 72, 0.12)" />`);
      parts.push(`<polyline points="${stdPts.join(' ')}" fill="none" stroke="#748494" stroke-width="2.2" stroke-dasharray="6 4" />`);
      parts.push(`<polyline points="${extPts.join(' ')}" fill="none" stroke="#0F5C48" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`);

      const labelEvery = totalYears > 25 ? 5 : totalYears > 15 ? 3 : totalYears > 10 ? 2 : 1;
      for (let yr = 0; yr <= totalYears; yr++) {
        if (yr === 0 || yr === totalYears || yr % labelEvery === 0) {
          parts.push(`<text x="${xForYear(yr).toFixed(1)}" y="${H - 10}" text-anchor="middle" fill="#4A5A6A" font-size="11" font-family="JetBrains Mono, monospace">${yr}</text>`);
        }
      }

      svgChart.innerHTML = parts.join('');
    }

    function exportCsv() {
      if (!lastRows.length) return;
      const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
      const headers = [
        I18N.loan.colYear,
        `${I18N.loan.colPayment} (${lastCur})`,
        `${I18N.loan.colPrincipal} (${lastCur})`,
        `${I18N.loan.colInterest} (${lastCur})`,
        `${I18N.loan.colBalance} (${lastCur})`,
        `${I18N.loan.colStdBalance} (${lastCur})`,
      ];
      const lines = [headers.map(esc).join(',')];
      lastRows.forEach((r) => {
        lines.push([r.year, r.paid.toFixed(2), r.principal.toFixed(2), r.interest.toFixed(2), r.balance.toFixed(2), r.stdBalance.toFixed(2)].map(esc).join(','));
      });
      const blob = new Blob([`\uFEFF${lines.join('\r\n')}\r\n`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calcledger-loan-${lastCur.toLowerCase()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      CL.showToast(I18N.loan.downloadedCsv || 'CSV downloaded');
    }

    function getState() {
      return {
        cur: currency.get(),
        amt: elAmount.value,
        r: elRate.value,
        y: elYears.value,
        extra: elExtra.value,
        lump: elLump.value,
      };
    }

    function calculate(syncUrl) {
      const principal = Math.max(100, CL.parseNum(elAmount.value, 100000));
      const annualRate = Math.max(0, Math.min(40, CL.parseNum(elRate.value, 0)));
      const years = Math.max(1, Math.min(40, Math.round(CL.parseNum(elYears.value, 25))));
      const extraMonthly = Math.max(0, CL.parseNum(elExtra.value, 0));
      const lumpSum = Math.max(0, CL.parseNum(elLump.value, 0));

      if (elRateSlider) elRateSlider.value = String(Math.min(18, annualRate));
      if (elYearsSlider) elYearsSlider.value = String(years);

      shell.querySelectorAll('[data-loan-amt]').forEach((btn) => {
        btn.classList.toggle('is-active', Math.abs(CL.parseNum(btn.getAttribute('data-loan-amt'), -1) - principal) < 1);
      });
      shell.querySelectorAll('[data-loan-extra]').forEach((btn) => {
        btn.classList.toggle('is-active', Math.abs(CL.parseNum(btn.getAttribute('data-loan-extra'), -1) - extraMonthly) < 0.01);
      });

      const n = years * 12;
      const r = annualRate / 100 / 12;
      let baseMonthly = 0;
      if (r > 1e-9) {
        const pow = Math.pow(1 + r, n);
        baseMonthly = (principal * r * pow) / (pow - 1);
      } else {
        baseMonthly = principal / n;
      }

      const std = simulateSchedule(principal, r, baseMonthly, 0, 0, n);
      const ext = simulateSchedule(principal, r, baseMonthly, extraMonthly, lumpSum, n);

      const interestSaved = Math.max(0, std.totalInterest - ext.totalInterest);
      const monthsSaved = Math.max(0, std.months - ext.months);
      const totalRepaid = principal + ext.totalInterest;
      const cur = currency.get();

      outMonthly.textContent = CL.formatMoney(baseMonthly, cur);
      outSaved.textContent = CL.formatMoney(interestSaved, cur);
      outTimeSaved.textContent = fmtDuration(monthsSaved);
      outPayoff.textContent = fmtDuration(ext.months);
      outInterest.textContent = CL.formatMoney(ext.totalInterest, cur);
      outTotal.textContent = CL.formatMoney(totalRepaid, cur);
      outBaseInt.textContent = CL.formatMoney(std.totalInterest, cur);
      outMonthlyTotal.textContent = CL.formatMoney(baseMonthly + extraMonthly, cur);

      const barDenom = Math.max(principal + std.totalInterest, 1);
      const pctP = (principal / barDenom) * 100;
      const pctI = (ext.totalInterest / barDenom) * 100;
      const pctS = (interestSaved / barDenom) * 100;

      barPrincipal.style.width = `${pctP.toFixed(2)}%`;
      barInterest.style.width = `${pctI.toFixed(2)}%`;
      barSaved.style.width = `${pctS.toFixed(2)}%`;
      legPrincipal.textContent = CL.formatPercent(pctP, 1);
      legInterest.textContent = CL.formatPercent(pctI, 1);
      legSaved.textContent = CL.formatPercent(pctS, 1);

      renderSvgChart(std.yearly, ext.yearly, principal, cur);

      const mergedRows = std.yearly.map((sr, idx) => {
        const er = ext.yearly[idx];
        return {
          year: sr.year,
          paid: er ? er.paid : 0,
          principal: er ? er.principal : 0,
          interest: er ? er.interest : 0,
          balance: er ? er.balance : 0,
          stdBalance: sr.balance,
        };
      });

      lastRows = mergedRows;
      lastCur = cur;

      tableBody.innerHTML = mergedRows
        .map(
          (row) => `<tr>
            <td class="num"><strong>${row.year}</strong></td>
            <td class="num">${CL.formatMoney(row.paid, cur)}</td>
            <td class="num">${CL.formatMoney(row.principal, cur)}</td>
            <td class="num">${CL.formatMoney(row.interest, cur)}</td>
            <td class="num"><strong>${CL.formatMoney(row.balance, cur)}</strong></td>
            <td class="num">${CL.formatMoney(row.stdBalance, cur)}</td>
          </tr>`
        )
        .join('');

      lastSummary = [
        `${I18N.loan.outMonthly}: ${CL.formatMoney(baseMonthly, cur)}`,
        `${I18N.loan.outInterestSaved}: ${CL.formatMoney(interestSaved, cur)}`,
        `${I18N.loan.outTimeSaved}: ${fmtDuration(monthsSaved)}`,
        `${I18N.loan.outTotalInterest}: ${CL.formatMoney(ext.totalInterest, cur)}`,
      ].join(' | ');

      if (syncUrl) CL.syncUrlState(getState());
    }

    const params = CL.readParams();
    if (params.has('cur')) currency.set(params.get('cur').toUpperCase(), true);
    if (params.has('amt')) elAmount.value = params.get('amt');
    if (params.has('r')) elRate.value = params.get('r');
    if (params.has('y')) elYears.value = params.get('y');
    if (params.has('extra')) elExtra.value = params.get('extra');
    if (params.has('lump')) elLump.value = params.get('lump');

    calculate(false);

    [elAmount, elRate, elYears, elExtra, elLump].forEach((el) => {
      el.addEventListener('input', () => calculate(true));
    });
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
    shell.querySelectorAll('[data-loan-amt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        elAmount.value = btn.getAttribute('data-loan-amt');
        calculate(true);
      });
    });
    shell.querySelectorAll('[data-loan-extra]').forEach((btn) => {
      btn.addEventListener('click', () => {
        elExtra.value = btn.getAttribute('data-loan-extra');
        calculate(true);
      });
    });
    document.querySelectorAll('tr[data-loan-extra]').forEach((row) => {
      const activate = () => {
        elExtra.value = row.getAttribute('data-loan-extra');
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

    document.getElementById('loan-copy-result').addEventListener('click', () => {
      CL.copyText(lastSummary, I18N.copiedResult);
    });
    const btnCsv = document.getElementById('loan-download-csv');
    if (btnCsv) btnCsv.addEventListener('click', exportCsv);
    document.getElementById('loan-copy-link').addEventListener('click', () => {
      CL.copyText(CL.buildShareUrl(getState()), I18N.copiedLink);
    });
    document.getElementById('loan-reset').addEventListener('click', () => {
      currency.set(defaultCurrency, true);
      elAmount.value = defaults.amount;
      elRate.value = defaults.rate;
      elYears.value = defaults.years;
      elExtra.value = defaults.extra;
      elLump.value = defaults.lump;
      calculate(true);
    });
  }

  /* ------------------------------------------------------------------------
     10. Salary, Pay Raise & 50/30/20 Budget Calculator
     ------------------------------------------------------------------------ */
  function initSalary(shell) {
    const CL = window.CalcLedger;
    const I18N = CL.I18N;
    const defaultCurrency = shell.getAttribute('data-default-currency') || 'EUR';

    const elAmount = document.getElementById('sal-amount');
    const elAmountLabel = document.getElementById('sal-amount-label');
    const elPeriod = document.getElementById('sal-period');
    const elTaxWrap = document.getElementById('sal-tax-wrap');
    const elTax = document.getElementById('sal-tax');
    const elHours = document.getElementById('sal-hours');
    const elRaise = document.getElementById('sal-raise');
    const elRaiseSlider = document.getElementById('sal-raise-slider');
    const elRule = document.getElementById('sal-rule');
    const elPurchase = document.getElementById('sal-purchase');

    const defaults = {
      amount: elAmount.value,
      period: elPeriod.value,
      tax: elTax.value,
      hours: elHours.value,
      raise: elRaise.value,
      rule: elRule.value,
      purchase: elPurchase.value,
    };

    const outMonthly = document.getElementById('sal-out-monthly');
    const outHourly = document.getElementById('sal-out-hourly');
    const outDaily = document.getElementById('sal-out-daily');
    const outYearly = document.getElementById('sal-out-yearly');
    const outRaiseMo = document.getElementById('sal-out-raise-mo');
    const outRaiseYr = document.getElementById('sal-out-raise-yr');
    const outWorkHours = document.getElementById('sal-out-workhours');
    const outEmergency = document.getElementById('sal-out-emergency');

    const barNeeds = document.getElementById('sal-bar-needs');
    const barWants = document.getElementById('sal-bar-wants');
    const barSavings = document.getElementById('sal-bar-savings');
    const legNeeds = document.getElementById('sal-leg-needs');
    const legWants = document.getElementById('sal-leg-wants');
    const legSavings = document.getElementById('sal-leg-savings');

    const tNeedsPct = document.getElementById('sal-t-needs-pct');
    const tWantsPct = document.getElementById('sal-t-wants-pct');
    const tSavingsPct = document.getElementById('sal-t-savings-pct');
    const tNeedsMo = document.getElementById('sal-t-needs-mo');
    const tWantsMo = document.getElementById('sal-t-wants-mo');
    const tSavingsMo = document.getElementById('sal-t-savings-mo');
    const tNeedsYr = document.getElementById('sal-t-needs-yr');
    const tWantsYr = document.getElementById('sal-t-wants-yr');
    const tSavingsYr = document.getElementById('sal-t-savings-yr');

    let mode = 'net'; // 'net' | 'gross'
    let lastSummary = '';
    const currency = bindCurrencySwitcher(shell, defaultCurrency, () => calculate(true));

    function setMode(nextMode, sync) {
      mode = nextMode === 'gross' ? 'gross' : 'net';
      shell.querySelectorAll('[data-sal-mode]').forEach((btn) => {
        const active = btn.getAttribute('data-sal-mode') === mode;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      if (elTaxWrap) elTaxWrap.hidden = mode !== 'gross';
      if (elAmountLabel) {
        elAmountLabel.textContent = mode === 'gross' ? I18N.salary.amountLabelGross : I18N.salary.amountLabelNet;
      }
      calculate(sync);
    }

    function getState() {
      return {
        cur: currency.get(),
        mode,
        amt: elAmount.value,
        per: elPeriod.value,
        tax: elTax.value,
        hrs: elHours.value,
        raise: elRaise.value,
        rule: elRule.value,
        buy: elPurchase.value,
      };
    }

    function calculate(syncUrl) {
      const amount = Math.max(0, CL.parseNum(elAmount.value, 0));
      const period = elPeriod.value || 'monthly';
      const taxPct = Math.max(0, Math.min(75, CL.parseNum(elTax.value, 25)));
      const hoursPerWeek = Math.max(5, Math.min(80, CL.parseNum(elHours.value, 40)));
      const raisePct = Math.max(0, Math.min(100, CL.parseNum(elRaise.value, 0)));
      const purchase = Math.max(0, CL.parseNum(elPurchase.value, 0));

      if (elRaiseSlider) elRaiseSlider.value = String(Math.min(50, raisePct));
      shell.querySelectorAll('[data-sal-tax]').forEach((btn) => {
        btn.classList.toggle('is-active', Math.abs(CL.parseNum(btn.getAttribute('data-sal-tax'), -1) - taxPct) < 0.1);
      });

      const annualHours = hoursPerWeek * 52;
      let annualInput = 0;
      if (period === 'monthly') annualInput = amount * 12;
      else if (period === 'yearly') annualInput = amount;
      else annualInput = amount * annualHours;

      const annualNet = mode === 'gross' ? annualInput * (1 - taxPct / 100) : annualInput;
      const monthlyNet = annualNet / 12;
      const hourlyNet = annualHours > 0 ? annualNet / annualHours : 0;
      const dailyNet = hourlyNet * 8;

      const raisedMonthly = monthlyNet * (1 + raisePct / 100);
      const raiseYearlyGain = annualNet * (raisePct / 100);

      const ruleParts = (elRule.value || '50-30-20').split('-').map((n) => parseInt(n, 10) || 0);
      const pNeeds = ruleParts[0] || 50;
      const pWants = ruleParts[1] || 30;
      const pSavings = ruleParts[2] || 20;

      const needsMo = monthlyNet * (pNeeds / 100);
      const wantsMo = monthlyNet * (pWants / 100);
      const savingsMo = monthlyNet * (pSavings / 100);
      const emergencyFund = needsMo * 6;

      const workHours = hourlyNet > 0 ? purchase / hourlyNet : 0;
      const workDays = workHours / 8;
      const workText = (I18N.salary.workHoursFmt || '{hours} h ({days} d)')
        .replace('{hours}', CL.formatNumber(workHours, 1))
        .replace('{days}', CL.formatNumber(workDays, 1));

      const cur = currency.get();
      outMonthly.textContent = CL.formatMoney(monthlyNet, cur);
      outHourly.textContent = CL.formatMoney(hourlyNet, cur);
      outDaily.textContent = CL.formatMoney(dailyNet, cur);
      outYearly.textContent = CL.formatMoney(annualNet, cur);
      outRaiseMo.textContent = CL.formatMoney(raisedMonthly, cur);
      outRaiseYr.textContent = `+${CL.formatMoney(raiseYearlyGain, cur)}`;
      outWorkHours.textContent = workText;
      outEmergency.textContent = CL.formatMoney(emergencyFund, cur);

      barNeeds.style.width = `${pNeeds}%`;
      barWants.style.width = `${pWants}%`;
      barSavings.style.width = `${pSavings}%`;
      legNeeds.textContent = `${pNeeds}%`;
      legWants.textContent = `${pWants}%`;
      legSavings.textContent = `${pSavings}%`;

      tNeedsPct.textContent = `${pNeeds}%`;
      tWantsPct.textContent = `${pWants}%`;
      tSavingsPct.textContent = `${pSavings}%`;
      tNeedsMo.textContent = CL.formatMoney(needsMo, cur);
      tWantsMo.textContent = CL.formatMoney(wantsMo, cur);
      tSavingsMo.textContent = CL.formatMoney(savingsMo, cur);
      tNeedsYr.textContent = CL.formatMoney(needsMo * 12, cur);
      tWantsYr.textContent = CL.formatMoney(wantsMo * 12, cur);
      tSavingsYr.textContent = CL.formatMoney(savingsMo * 12, cur);

      lastSummary = [
        `${I18N.salary.outMonthlyNet}: ${CL.formatMoney(monthlyNet, cur)}`,
        `${I18N.salary.outHourlyNet}: ${CL.formatMoney(hourlyNet, cur)}`,
        `${I18N.salary.outYearlyNet}: ${CL.formatMoney(annualNet, cur)}`,
      ].join(' | ');

      if (syncUrl) CL.syncUrlState(getState());
    }

    const params = CL.readParams();
    if (params.has('cur')) currency.set(params.get('cur').toUpperCase(), true);
    if (params.has('amt')) elAmount.value = params.get('amt');
    if (params.has('per')) elPeriod.value = params.get('per');
    if (params.has('tax')) elTax.value = params.get('tax');
    if (params.has('hrs')) elHours.value = params.get('hrs');
    if (params.has('raise')) elRaise.value = params.get('raise');
    if (params.has('rule')) elRule.value = params.get('rule');
    if (params.has('buy')) elPurchase.value = params.get('buy');

    setMode(params.get('mode') === 'gross' ? 'gross' : 'net', false);

    shell.querySelectorAll('[data-sal-mode]').forEach((btn) => {
      btn.addEventListener('click', () => setMode(btn.getAttribute('data-sal-mode'), true));
    });
    shell.querySelectorAll('[data-sal-tax]').forEach((btn) => {
      btn.addEventListener('click', () => {
        elTax.value = btn.getAttribute('data-sal-tax');
        calculate(true);
      });
    });

    [elAmount, elTax, elHours, elRaise, elPurchase].forEach((el) => {
      el.addEventListener('input', () => calculate(true));
    });
    [elPeriod, elRule].forEach((el) => {
      el.addEventListener('change', () => calculate(true));
    });
    if (elRaiseSlider) {
      elRaiseSlider.addEventListener('input', () => {
        elRaise.value = elRaiseSlider.value;
        calculate(true);
      });
    }

    document.getElementById('sal-copy-result').addEventListener('click', () => {
      CL.copyText(lastSummary, I18N.copiedResult);
    });
    document.getElementById('sal-copy-link').addEventListener('click', () => {
      CL.copyText(CL.buildShareUrl(getState()), I18N.copiedLink);
    });
    document.getElementById('sal-reset').addEventListener('click', () => {
      currency.set(defaultCurrency, true);
      elAmount.value = defaults.amount;
      elPeriod.value = defaults.period;
      elTax.value = defaults.tax;
      elHours.value = defaults.hours;
      elRaise.value = defaults.raise;
      elRule.value = defaults.rule;
      elPurchase.value = defaults.purchase;
      setMode('net', true);
    });
  }

  /* ------------------------------------------------------------------------
     11. Percentage, Discount & Change Calculator
     ------------------------------------------------------------------------ */
  function initPercentage(shell) {
    const CL = window.CalcLedger;
    const I18N = CL.I18N;
    const defaultCurrency = shell.getAttribute('data-default-currency') || 'EUR';

    const panelDiscount = document.getElementById('pct-panel-discount');
    const panelOf = document.getElementById('pct-panel-of');
    const panelChange = document.getElementById('pct-panel-change');

    const elOrigPrice = document.getElementById('pct-orig-price');
    const elDisc = document.getElementById('pct-disc');
    const elExtraDisc = document.getElementById('pct-extra-disc');
    const elPartRate = document.getElementById('pct-part-rate');
    const elBaseNum = document.getElementById('pct-base-num');
    const elFrom = document.getElementById('pct-from');
    const elTo = document.getElementById('pct-to');

    const heroBox = document.getElementById('pct-hero-box');
    const outPrimaryLabel = document.getElementById('pct-out-primary-label');
    const outPrimary = document.getElementById('pct-out-primary');
    const k1Label = document.getElementById('pct-k1-label');
    const k1Val = document.getElementById('pct-k1-val');
    const k2Label = document.getElementById('pct-k2-label');
    const k2Val = document.getElementById('pct-k2-val');
    const barWrap = document.getElementById('pct-bar-wrap');
    const barA = document.getElementById('pct-bar-a');
    const barB = document.getElementById('pct-bar-b');
    const legend = document.getElementById('pct-legend');

    let mode = 'discount'; // 'discount' | 'of' | 'change'
    let lastSummary = '';
    const currency = bindCurrencySwitcher(shell, defaultCurrency, () => calculate(true));

    function setMode(nextMode, sync) {
      mode = ['discount', 'of', 'change'].includes(nextMode) ? nextMode : 'discount';
      shell.querySelectorAll('[data-pct-mode]').forEach((btn) => {
        const active = btn.getAttribute('data-pct-mode') === mode;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      panelDiscount.hidden = mode !== 'discount';
      panelOf.hidden = mode !== 'of';
      panelChange.hidden = mode !== 'change';
      calculate(sync);
    }

    function getState() {
      return {
        cur: currency.get(),
        mode,
        p: elOrigPrice.value,
        d1: elDisc.value,
        d2: elExtraDisc.value,
        r: elPartRate.value,
        base: elBaseNum.value,
        from: elFrom.value,
        to: elTo.value,
      };
    }

    function calculate(syncUrl) {
      const cur = currency.get();
      heroBox.classList.remove('is-loss');

      if (mode === 'discount') {
        const orig = Math.max(0, CL.parseNum(elOrigPrice.value, 0));
        const d1 = Math.max(0, Math.min(100, CL.parseNum(elDisc.value, 0)));
        const d2 = Math.max(0, Math.min(100, CL.parseNum(elExtraDisc.value, 0)));

        const after1 = orig * (1 - d1 / 100);
        const finalPrice = after1 * (1 - d2 / 100);
        const saved = Math.max(0, orig - finalPrice);
        const effDisc = orig > 0 ? (saved / orig) * 100 : 0;
        const payPct = Math.max(0, 100 - effDisc);

        outPrimaryLabel.textContent = I18N.percentage.outFinalPrice;
        outPrimary.textContent = CL.formatMoney(finalPrice, cur);
        k1Label.textContent = I18N.percentage.outYouSave;
        k1Val.textContent = CL.formatMoney(saved, cur);
        k2Label.textContent = I18N.percentage.outEffDiscount;
        k2Val.textContent = CL.formatPercent(effDisc, 2);

        barWrap.hidden = false;
        barA.style.width = `${payPct.toFixed(2)}%`;
        barB.style.width = `${effDisc.toFixed(2)}%`;
        legend.innerHTML = [
          `<span><i class="dot seg-navy"></i>${I18N.percentage.outFinalPrice} <strong class="num">${CL.formatPercent(payPct, 1)}</strong></span>`,
          `<span><i class="dot seg-emerald"></i>${I18N.percentage.outYouSave} <strong class="num">${CL.formatPercent(effDisc, 1)}</strong></span>`,
        ].join('');

        shell.querySelectorAll('[data-pct-disc]').forEach((btn) => {
          btn.classList.toggle('is-active', Math.abs(CL.parseNum(btn.getAttribute('data-pct-disc'), -1) - d1) < 0.01);
        });
        shell.querySelectorAll('[data-pct-extra]').forEach((btn) => {
          btn.classList.toggle('is-active', Math.abs(CL.parseNum(btn.getAttribute('data-pct-extra'), -1) - d2) < 0.01);
        });
        document.querySelectorAll('[data-apply-disc]').forEach((row) => {
          row.classList.toggle('is-selected', Math.abs(CL.parseNum(row.getAttribute('data-apply-disc'), -1) - d1) < 0.01 && d2 === 0);
        });

        lastSummary = `${I18N.percentage.outFinalPrice}: ${CL.formatMoney(finalPrice, cur)} | ${I18N.percentage.outYouSave}: ${CL.formatMoney(saved, cur)} (${CL.formatPercent(effDisc, 1)})`;
      } else if (mode === 'of') {
        const pct = Math.max(0, CL.parseNum(elPartRate.value, 0));
        const base = CL.parseNum(elBaseNum.value, 0);
        const part = (base * pct) / 100;
        const remainder = base - part;
        const plus = base + part;

        outPrimaryLabel.textContent = I18N.percentage.outOfResult;
        outPrimary.textContent = CL.formatMoney(part, cur);
        k1Label.textContent = I18N.percentage.outRemainder;
        k1Val.textContent = CL.formatMoney(remainder, cur);
        k2Label.textContent = I18N.percentage.outPlusPct;
        k2Val.textContent = CL.formatMoney(plus, cur);

        const clamped = Math.max(0, Math.min(100, pct));
        barWrap.hidden = false;
        barA.style.width = `${(100 - clamped).toFixed(2)}%`;
        barB.style.width = `${clamped.toFixed(2)}%`;
        legend.innerHTML = [
          `<span><i class="dot seg-emerald"></i>${CL.formatPercent(pct, 1)}</span>`,
          `<span><i class="dot seg-navy"></i>${I18N.percentage.outRemainder} <strong class="num">${CL.formatPercent(Math.max(0, 100 - clamped), 1)}</strong></span>`,
        ].join('');

        lastSummary = `${CL.formatPercent(pct, 1)} × ${CL.formatMoney(base, cur)} = ${CL.formatMoney(part, cur)}`;
      } else {
        const oldVal = CL.parseNum(elFrom.value, 0);
        const newVal = CL.parseNum(elTo.value, 0);
        const diff = newVal - oldVal;
        const pctChange = oldVal !== 0 ? (diff / Math.abs(oldVal)) * 100 : 0;
        const mult = oldVal !== 0 ? newVal / oldVal : 0;

        const sign = pctChange > 0 ? '+' : '';
        heroBox.classList.toggle('is-loss', pctChange < 0);
        outPrimaryLabel.textContent = I18N.percentage.outChangePct;
        outPrimary.textContent = `${sign}${CL.formatPercent(pctChange, 2)}`;
        k1Label.textContent = I18N.percentage.outChangeDiff;
        k1Val.textContent = `${diff > 0 ? '+' : ''}${CL.formatMoney(diff, cur)}`;
        k2Label.textContent = I18N.percentage.outMultiplier;
        k2Val.textContent = `${mult.toFixed(3)}×`;

        barWrap.hidden = true;
        lastSummary = `${I18N.percentage.outChangePct}: ${sign}${CL.formatPercent(pctChange, 2)} (${diff > 0 ? '+' : ''}${CL.formatMoney(diff, cur)})`;
      }

      if (syncUrl) CL.syncUrlState(getState());
    }

    const params = CL.readParams();
    if (params.has('cur')) currency.set(params.get('cur').toUpperCase(), true);
    if (params.has('p')) elOrigPrice.value = params.get('p');
    if (params.has('d1')) elDisc.value = params.get('d1');
    if (params.has('d2')) elExtraDisc.value = params.get('d2');
    if (params.has('r')) elPartRate.value = params.get('r');
    if (params.has('base')) elBaseNum.value = params.get('base');
    if (params.has('from')) elFrom.value = params.get('from');
    if (params.has('to')) elTo.value = params.get('to');

    setMode(params.get('mode') || 'discount', false);

    shell.querySelectorAll('[data-pct-mode]').forEach((btn) => {
      btn.addEventListener('click', () => setMode(btn.getAttribute('data-pct-mode'), true));
    });
    [elOrigPrice, elDisc, elExtraDisc, elPartRate, elBaseNum, elFrom, elTo].forEach((el) => {
      el.addEventListener('input', () => calculate(true));
    });
    shell.querySelectorAll('[data-pct-disc]').forEach((btn) => {
      btn.addEventListener('click', () => {
        elDisc.value = btn.getAttribute('data-pct-disc');
        calculate(true);
      });
    });
    shell.querySelectorAll('[data-pct-extra]').forEach((btn) => {
      btn.addEventListener('click', () => {
        elExtraDisc.value = btn.getAttribute('data-pct-extra');
        calculate(true);
      });
    });
    document.querySelectorAll('[data-apply-disc]').forEach((row) => {
      const activate = () => {
        elDisc.value = row.getAttribute('data-apply-disc');
        elExtraDisc.value = '0';
        setMode('discount', true);
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

    document.getElementById('pct-copy-result').addEventListener('click', () => {
      CL.copyText(lastSummary, I18N.copiedResult);
    });
    document.getElementById('pct-copy-link').addEventListener('click', () => {
      CL.copyText(CL.buildShareUrl(getState()), I18N.copiedLink);
    });
    document.getElementById('pct-reset').addEventListener('click', () => {
      currency.set(defaultCurrency, true);
      elOrigPrice.value = '250';
      elDisc.value = '25';
      elExtraDisc.value = '0';
      elPartRate.value = '20';
      elBaseNum.value = '1500';
      elFrom.value = '2500';
      elTo.value = '2850';
      setMode('discount', true);
    });
  }

  /* ------------------------------------------------------------------------
     12. Fuel Cost, Road Trip & Commute Calculator (Petrol / Diesel / LPG / EV)
     ------------------------------------------------------------------------ */
  function initFuel(shell) {
    const CL = window.CalcLedger;
    const I18N = CL.I18N;
    const defaultCurrency = shell.getAttribute('data-default-currency') || 'EUR';
    let presets = {};
    try {
      presets = JSON.parse(shell.getAttribute('data-fuel-presets') || '{}');
    } catch (_) {
      presets = {};
    }

    const elDist = document.getElementById('fuel-dist');
    const elDistLabel = document.getElementById('fuel-dist-label');
    const elRoundtripWrap = document.getElementById('fuel-roundtrip-wrap');
    const elRoundtrip = document.getElementById('fuel-roundtrip');
    const elCons = document.getElementById('fuel-cons');
    const elConsLabel = document.getElementById('fuel-cons-label');
    const elPrice = document.getElementById('fuel-price');
    const elPriceLabel = document.getElementById('fuel-price-label');
    const elPassengersWrap = document.getElementById('fuel-passengers-wrap');
    const elPassengers = document.getElementById('fuel-passengers');
    const elDaysWrap = document.getElementById('fuel-days-wrap');
    const elDays = document.getElementById('fuel-days');

    const defaults = {
      dist: elDist.value,
      cons: elCons.value,
      price: elPrice.value,
      pax: elPassengers.value,
      days: elDays.value,
    };

    const elPrimaryLabel = document.getElementById('fuel-primary-label');
    const outPrimary = document.getElementById('fuel-out-primary');
    const elSecondaryLabel = document.getElementById('fuel-secondary-label');
    const outSecondary = document.getElementById('fuel-out-secondary');
    const outPer100 = document.getElementById('fuel-out-per100');
    const outLiters = document.getElementById('fuel-out-liters');
    const outDist = document.getElementById('fuel-out-dist');
    const outCo2 = document.getElementById('fuel-out-co2');
    const compareBody = document.getElementById('fuel-compare-body');

    let mode = 'trip'; // 'trip' | 'commute'
    let fuelType = 'petrol'; // 'petrol' | 'diesel' | 'lpg' | 'ev'
    let lastSummary = '';
    const currency = bindCurrencySwitcher(shell, defaultCurrency, () => calculate(true));

    function setLabelTextKeepingHint(labelEl, text) {
      if (!labelEl) return;
      const hintBtn = labelEl.querySelector('.hint-btn');
      labelEl.textContent = text;
      if (hintBtn) {
        labelEl.appendChild(document.createTextNode(' '));
        labelEl.appendChild(hintBtn);
      }
    }

    function setMode(nextMode, sync) {
      mode = nextMode === 'commute' ? 'commute' : 'trip';
      shell.querySelectorAll('[data-fuel-mode]').forEach((btn) => {
        const active = btn.getAttribute('data-fuel-mode') === mode;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      if (elDistLabel) {
        elDistLabel.textContent = mode === 'commute' ? I18N.fuel.distanceLabelCommute : I18N.fuel.distanceLabelTrip;
      }
      if (elRoundtripWrap) elRoundtripWrap.hidden = mode === 'commute';
      if (elPassengersWrap) elPassengersWrap.hidden = mode === 'commute';
      if (elDaysWrap) elDaysWrap.hidden = mode !== 'commute';
      if (elPrimaryLabel) {
        elPrimaryLabel.textContent = mode === 'commute' ? I18N.fuel.outMonthlyCommute : I18N.fuel.outTripCost;
      }
      if (elSecondaryLabel) {
        elSecondaryLabel.textContent = mode === 'commute' ? I18N.fuel.outYearlyCommute : I18N.fuel.outPerPerson;
      }
      calculate(sync);
    }

    function setFuelType(nextType, applyDefaults, sync) {
      fuelType = ['petrol', 'diesel', 'lpg', 'ev'].includes(nextType) ? nextType : 'petrol';
      shell.querySelectorAll('[data-fuel-type]').forEach((btn) => {
        btn.classList.toggle('is-active', btn.getAttribute('data-fuel-type') === fuelType);
      });
      const isEv = fuelType === 'ev';
      setLabelTextKeepingHint(elConsLabel, isEv ? I18N.fuel.consumptionLabelEv : I18N.fuel.consumptionLabelFuel);
      if (elPriceLabel) elPriceLabel.textContent = isEv ? I18N.fuel.priceLabelEv : I18N.fuel.priceLabelFuel;
      if (applyDefaults && presets[fuelType]) {
        elCons.value = presets[fuelType].cons;
        elPrice.value = presets[fuelType].price;
      }
      calculate(sync);
    }

    function getState() {
      return {
        cur: currency.get(),
        mode,
        type: fuelType,
        dist: elDist.value,
        rt: elRoundtrip && elRoundtrip.checked ? '1' : '0',
        cons: elCons.value,
        price: elPrice.value,
        pax: elPassengers.value,
        days: elDays.value,
      };
    }

    function calculate(syncUrl) {
      const distOneWay = Math.max(0, CL.parseNum(elDist.value, 0));
      const cons = Math.max(0, CL.parseNum(elCons.value, 0));
      const price = Math.max(0, CL.parseNum(elPrice.value, 0));
      const pax = Math.max(1, Math.min(9, Math.round(CL.parseNum(elPassengers.value, 1))));
      const days = Math.max(1, Math.min(31, Math.round(CL.parseNum(elDays.value, 21))));
      const roundTrip = elRoundtrip ? elRoundtrip.checked : false;

      const totalDist = mode === 'commute' ? distOneWay * 2 * days : distOneWay * (roundTrip ? 2 : 1);
      const costPer100 = cons * price;
      const unitsNeeded = (totalDist / 100) * cons;
      const totalCost = unitsNeeded * price;
      const secondaryVal = mode === 'commute' ? totalCost * 12 : totalCost / pax;

      const co2Factor = (presets[fuelType] && presets[fuelType].co2) || 2.31;
      const co2Kg = unitsNeeded * co2Factor;
      const unitLabel = fuelType === 'ev' ? 'kWh' : 'L';
      const cur = currency.get();

      outPrimary.textContent = CL.formatMoney(totalCost, cur);
      outSecondary.textContent = CL.formatMoney(secondaryVal, cur);
      outPer100.textContent = CL.formatMoney(costPer100, cur);
      outLiters.textContent = `${CL.formatNumber(unitsNeeded, 1)} ${unitLabel}`;
      outDist.textContent = `${CL.formatNumber(totalDist, 0)} km`;
      outCo2.textContent = `${CL.formatNumber(co2Kg, 1)} kg`;

      shell.querySelectorAll('[data-fuel-dist]').forEach((btn) => {
        btn.classList.toggle('is-active', Math.abs(CL.parseNum(btn.getAttribute('data-fuel-dist'), -1) - distOneWay) < 0.1);
      });
      shell.querySelectorAll('[data-fuel-pax]').forEach((btn) => {
        btn.classList.toggle('is-active', Math.round(CL.parseNum(btn.getAttribute('data-fuel-pax'), -1)) === pax);
      });

      if (compareBody) {
        const rows = [
          { key: 'petrol', name: I18N.fuel.typePetrol, unit: 'L/100km' },
          { key: 'diesel', name: I18N.fuel.typeDiesel, unit: 'L/100km' },
          { key: 'lpg', name: I18N.fuel.typeLpg, unit: 'L/100km' },
          { key: 'ev', name: I18N.fuel.typeEv, unit: 'kWh/100km' },
        ].map((item) => {
          const pr = presets[item.key] || { cons: 7.5, price: 1.5 };
          const c = item.key === fuelType ? cons : pr.cons;
          const p = item.key === fuelType ? price : pr.price;
          const distCost = (totalDist / 100) * c * p;
          const yearly15k = (15000 / 100) * c * p;
          return { ...item, c, distCost, yearly15k };
        });

        const minYearly = Math.min(...rows.map((r) => r.yearly15k));
        compareBody.innerHTML = rows
          .map((r) => {
            const isBest = Math.abs(r.yearly15k - minYearly) < 0.01;
            const isCur = r.key === fuelType;
            return `<tr class="clickable-row${isCur ? ' is-selected' : ''}" data-pick-fuel="${r.key}" tabindex="0" role="button">
              <td><strong>${r.name}</strong>${isBest ? `<span class="badge-best">Min</span>` : ''}</td>
              <td class="num">${CL.formatNumber(r.c, 1)} ${r.unit}</td>
              <td class="num"><strong>${CL.formatMoney(r.distCost, cur)}</strong></td>
              <td class="num">${CL.formatMoney(r.yearly15k, cur)}</td>
            </tr>`;
          })
          .join('');

        compareBody.querySelectorAll('[data-pick-fuel]').forEach((row) => {
          row.addEventListener('click', () => {
            setFuelType(row.getAttribute('data-pick-fuel'), true, true);
          });
        });
      }

      lastSummary = [
        `${mode === 'commute' ? I18N.fuel.outMonthlyCommute : I18N.fuel.outTripCost}: ${CL.formatMoney(totalCost, cur)}`,
        `${mode === 'commute' ? I18N.fuel.outYearlyCommute : I18N.fuel.outPerPerson}: ${CL.formatMoney(secondaryVal, cur)}`,
        `${I18N.fuel.outCostPer100}: ${CL.formatMoney(costPer100, cur)}`,
      ].join(' | ');

      if (syncUrl) CL.syncUrlState(getState());
    }

    const params = CL.readParams();
    if (params.has('cur')) currency.set(params.get('cur').toUpperCase(), true);
    if (params.has('dist')) elDist.value = params.get('dist');
    if (params.has('rt') && elRoundtrip) elRoundtrip.checked = params.get('rt') === '1';
    if (params.has('cons')) elCons.value = params.get('cons');
    if (params.has('price')) elPrice.value = params.get('price');
    if (params.has('pax')) elPassengers.value = params.get('pax');
    if (params.has('days')) elDays.value = params.get('days');

    const initType = params.get('type') || 'petrol';
    const initMode = params.get('mode') === 'commute' ? 'commute' : 'trip';
    setFuelType(initType, false, false);
    setMode(initMode, false);

    shell.querySelectorAll('[data-fuel-mode]').forEach((btn) => {
      btn.addEventListener('click', () => setMode(btn.getAttribute('data-fuel-mode'), true));
    });
    shell.querySelectorAll('[data-fuel-type]').forEach((btn) => {
      btn.addEventListener('click', () => setFuelType(btn.getAttribute('data-fuel-type'), true, true));
    });
    shell.querySelectorAll('[data-fuel-dist]').forEach((btn) => {
      btn.addEventListener('click', () => {
        elDist.value = btn.getAttribute('data-fuel-dist');
        calculate(true);
      });
    });
    shell.querySelectorAll('[data-fuel-pax]').forEach((btn) => {
      btn.addEventListener('click', () => {
        elPassengers.value = btn.getAttribute('data-fuel-pax');
        calculate(true);
      });
    });

    [elDist, elCons, elPrice, elPassengers, elDays].forEach((el) => {
      el.addEventListener('input', () => calculate(true));
    });
    if (elRoundtrip) elRoundtrip.addEventListener('change', () => calculate(true));

    document.getElementById('fuel-copy-result').addEventListener('click', () => {
      CL.copyText(lastSummary, I18N.copiedResult);
    });
    document.getElementById('fuel-copy-link').addEventListener('click', () => {
      CL.copyText(CL.buildShareUrl(getState()), I18N.copiedLink);
    });
    document.getElementById('fuel-reset').addEventListener('click', () => {
      currency.set(defaultCurrency, true);
      elDist.value = defaults.dist;
      elCons.value = defaults.cons;
      elPrice.value = defaults.price;
      elPassengers.value = defaults.pax;
      elDays.value = defaults.days;
      if (elRoundtrip) elRoundtrip.checked = false;
      setFuelType('petrol', true, false);
      setMode('trip', true);
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
    else if (type === 'loan') initLoan(shell);
    else if (type === 'salary') initSalary(shell);
    else if (type === 'percentage') initPercentage(shell);
    else if (type === 'fuel') initFuel(shell);
  });
})();
