---
title: "Zeliade Quant Framework"
eyebrow: "Analytics library"
description: "ZQF is an extensible, cross-platform C# library for pricing, calibration and risk management of derivatives across credit, equity, FX and interest rate markets."
lede: "The Zeliade team develops since several years ZQF (Zeliade Quant Framework), a quantitative library for pricing and risk management of derivatives across the main markets."
---

## An extensible and cross-platform framework for pricing and risk management

**Pricing, calibration and risk framework.** ZQF provides a comprehensive production grade set of
pricers and calibrators for the mainstream quantitative models. A particular focus is done on:

- **Credit markets:** CDS, indices, index tranches, bespoke tranches, options, with fast analytic or
  semi-analytic formulas for price, greeks and stress testing.
- **Equity and FX markets:** state-of-the-art parametric volatility surface models.

**Monte Carlo engine.** A generic MonteCarlo engine is available, providing builtin models, processes
and tasks. The engine can be extended with user defined models and tasks through a C# SDK, and
natively supports multithreaded calculation.

**Scripting capabilities.** A simple and powerful product DSL is available for coding products and
portfolios.

**Modern tech and cross-platform.** ZQF is a 100% C# native library based on .NET 4.5.2 running on
both Windows and Linux/Mono. It can be invoked from Python, from Jupyter notebooks and from Excel.

## New module: Total Return Swap pricing and risk tool

Zeliade developed, for an independent wealth manager, a pricing and risk tool for Total Return Swaps.
The tool computes the price and sensitivities with respect to equity, repo, dividend, IR, FX and
all-in.

The TRS scope includes equity underlying performance versus fixed rate, interest rate floating index
(Euribor, Eonia, …) or equity underlying performance, with special features such as fixed notional
and resetting TRS, and specific collateralization schemes (cash, no collateral, securities
collateral).
