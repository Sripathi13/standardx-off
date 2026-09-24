# STANDARD X - Estimation Engine Specification

## 1. Engineering Foundation & Standards Compliance
The estimation engine implements the empirical guidelines and statutory requirements of:
- **IS 456:2000**: Code of Practice for Plain and Reinforced Concrete
- **SP 16**: Design Aids for Reinforced Concrete to IS 456
- **IRC:58-2015**: Guidelines for the Design of Plain Jointed Rigid Pavements for Highways
- **IRC:37-2018**: Guidelines for the Design of Flexible Pavements
- **MoRTH**: Specifications for Road and Bridge Works (5th Revision, Ministry of Road Transport & Highways)
- **IRC:112-2020**: Code of Practice for Concrete Road Bridges

---

## 2. Multi-Typology Estimation Models

### 2.1 Commercial & Residential Buildings (RCC, Steel, Load-Bearing)
Input parameters:
- $A$: Total Built-Up Area in square feet (clamped to minimum $100\text{ sq.ft}$)
- $F$: Number of stories / floors
- $H$: Floor-to-floor height (meters)
- $S$: Structural framing system:
  - RCC Framed Structure
  - Load-Bearing Structure
  - Steel Structure

#### Height Multiplier ($K_f$)
Tall structures experience elevated wind moments, higher column loads, and heavier foundation sizes:
$$K_f = \begin{cases} 1.05 & \text{if } F > 3 \\ 1.00 & \text{otherwise} \end{cases}$$

#### Material Coefficients

| Parameter | RCC Framed | Load-Bearing | Steel Structure | Unit | Wastage Factor |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Cement** | $0.42 \times K_f$ | $0.35 \times K_f$ | $0.25 \times K_f$ | bags/sq.ft | $+5\%$ |
| **Steel Rebar** | $4.00 \times K_f$ | $2.00 \times K_f$ | $2.20 \times K_f$ | kg/sq.ft | $+3\%$ |
| **River / M-Sand** | $0.052$ | $0.052$ | $0.030$ | $\text{m}^3/\text{sq.ft}$ | $+6\%$ |
| **Coarse Aggregate** | $0.038$ | $0.038$ | $0.022$ | $\text{m}^3/\text{sq.ft}$ | $+4\%$ |
| **Bricks / AAC** | $18.0$ | $22.0$ | $14.0$ | units/sq.ft | $+7\%$ |
| **Potable Water** | $165\text{ Liters / Cement Bag}$ | $165\text{ Liters / Bag}$ | $150\text{ Liters / Bag}$ | kL | $+8\%$ |
| **Binding Wire** | $1.1\%$ of Rebar Weight | $1.1\%$ of Rebar | $0.8\%$ of Rebar | kg | $+5\%$ |

---

### 2.2 Highway & Pavement Infrastructure

#### A. Rigid Concrete Pavement (PQC)
1. **Surface Area**:
   $$S = L \times 1000 \times W \quad (\text{m}^2)$$
   where $L$ is length in km, and $W$ is carriageway width in meters.
2. **PQC Concrete Volume**:
   $$V_{\text{pqc}} = S \times (T / 1000) \quad (\text{m}^3)$$
   where $T$ is pavement thickness in mm.
3. **PQC Cement (Grade 53 OPC)**:
   $$Q_c = \text{round}(V_{\text{pqc}} \times 7.8) \quad (\text{bags})$$
   (Corresponding to $390\text{ kg/m}^3$ cement content complying with IRC:58 minimum durability criteria).
4. **Dowel & Tie Steel**:
   $$Q_s = \text{round}(S \times 3.6) \quad (\text{kg})$$
   (Accounts for 32mm dowel bars at expansion joints and 12mm tie bars at longitudinal joints).
5. **Granular Sub-Base (GSB)**:
   $$V_{\text{gsb}} = (L \times 1000) \times (W + 0.8) \times 0.15 \quad (\text{m}^3)$$
   (Includes $0.8\text{m}$ shoulder extension and $150\text{mm}$ drainage layer).

#### B. Flexible Bituminous Pavement
1. **Asphalt Mix Crust Volume**:
   $$V_{\text{bit}} = S \times (T / 1000) \quad (\text{m}^3)$$
2. **Compacted Mix Weight**:
   $$M_{\text{bit}} = \text{round}(V_{\text{bit}} \times 2.42) \quad (\text{Tonnes})$$
   (Compacted bulk density $\rho = 2.42\text{ T/m}^3$).
3. **Bitumen VG-30 Binder Quantity**:
   $$M_{\text{binder}} = M_{\text{bit}} \times 0.049 \quad (\text{Tonnes})$$
   ($4.9\%$ optimum bitumen content by weight of mix).
4. **Wet Mix Macadam (WMM Base Course)**:
   $$V_{\text{wmm}} = S \times 0.225 \quad (\text{m}^3) \quad (225\text{mm thickness})$$

---

### 2.3 Concrete Bridges & Flyovers (IRC:112)
1. **Superstructure & Pier Concrete Volume**:
   $$V_{\text{bridge}} = \text{round}(L_{\text{span}} \times W_{\text{deck}} \times 0.85 + (H_{\text{pier}} \times W_{\text{deck}} \times 1.4)) \quad (\text{m}^3)$$
2. **High-Performance Cement (OPC 53 M45/M50)**:
   $$Q_c = \text{round}(V_{\text{bridge}} \times 8.2) \quad (\text{bags})$$
   ($410\text{ kg/m}^3$ minimum cementitious content for severe environmental exposure).
3. **Super Ductile Rebar (Fe 550D)**:
   $$Q_s = \text{round}(V_{\text{bridge}} \times 135) \quad (\text{kg})$$
   ($135\text{ kg/m}^3$ reinforcement density per IRC:112 seismic design criteria).
4. **Galvanized Binding Wire**:
   $$Q_{\text{wire}} = \text{round}(Q_s \times 0.012) \quad (\text{kg}) \quad (1.2\%)$$
