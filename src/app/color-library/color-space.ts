let xyz_: Xyz;

const DefaultPrecision = 0.0001;
const Epsilon = 0.008856;
const Kappa = 903.3;

export enum ColorSpacesTypes {
  RGB,
  LAB,
  HEX,
  CMY,
  CMYK,
  LCH,
}
export interface IConverters {
  rgb: Rgb;
  lab: Lab;
  cmy: Cmy;
  cmyk: Cmyk;
  lch: Lch;
  hex: Hex;
}

export class ConverterComparer implements IConverters {
  rgb: Rgb;
  lab: Lab;
  cmy: Cmy;
  cmyk: Cmyk;
  lch: Lch;
  hex: Hex;

  constructor(options?: { R?: number; G?: number; B?: number }) {
    const settings = Object.assign({ R: 0, G: 0, B: 0 }, options);

    // CreateInstanceColorSpace( ColorSpacesTypes.LAB, )

    this.rgb = new Rgb().initialize(settings);
    // this.updateFromColor(this.rgb);
    this.lab = new Lab().initialize(settings);
    this.cmy = new Cmy().initialize(settings);
    this.cmyk = new Cmyk().initialize(settings);
    this.lch = new Lch().initialize(settings);
    this.hex = new Hex().initialize(settings);
  }

  updateFromColor(colorSpace: IColorSpace) {
    this.cmy = colorSpace.To(ColorSpacesTypes.CMY) as Cmy;
    this.cmyk = colorSpace.To(ColorSpacesTypes.CMYK) as Cmyk;
    this.hex = colorSpace.To(ColorSpacesTypes.HEX) as Hex;
    this.lab = colorSpace.To(ColorSpacesTypes.LAB) as Lab;
    this.lch = colorSpace.To(ColorSpacesTypes.LCH) as Lch;
    this.rgb = colorSpace.To(ColorSpacesTypes.RGB) as Rgb;
  }
}

//#region unexported Functions

function RoundAwayFromZero(startValue, digits): number {
  let decimalValue = 0;
  digits = digits || 0;
  startValue *= parseFloat(Math.pow(10, digits + 1).toString());
  decimalValue = parseInt(Math.floor(startValue).toString(), 10) - Math.floor(startValue / 10) * 10;
  startValue = Math.floor(startValue / 10);
  if (decimalValue >= 5) {
    startValue += 1;
  }
  startValue /= parseFloat(Math.pow(10, digits).toString());
  return startValue;
}

function SetterCheck(s: string): string {
  const regex = /^[0-9A-Fa-f]{1,2}$/g;
  if (!regex.test(s)) {
    throw new Error('Formato incorrecto');
  }
  return s.length < 2 ? '0' + s : s;
}

function WhiteReference() {
  if (xyz_ === undefined) {
    xyz_ = new Xyz();
    Object.assign(xyz_, { X: 95.047, Y: 100, Z: 108.883 });
  }
  return xyz_;
}

function CubicRoot(n: number) {
  return Math.pow(n, 1.0 / 3.0);
}

// #endregion

// #region Exported Function
export function CreateInstanceColorSpace(
  colorSpace: ColorSpacesTypes,
  options?: {
    CMYK?: { C: number; M: number; Y: number; K?: number };
    Rgb?: { R: number; G: number; B: number };
    Lch?: { L: number; C: number; H: number };
    Xyz?: { X: number; Y: number; Z: number };
    Lab?: { L: number; A: number; B: number };
    Hex?: { Code: string };
  },
): IColorSpace {
  const settings = {
    CMYK: { C: 0, M: 0, Y: 0, K: 0 },
    Rgb: { R: 0, G: 0, B: 0 },
    Lch: { L: 0, C: 0, H: 0 },
    Xyz: { X: 0, Y: 0, Z: 0 },
    Lab: { L: 0, A: 0, B: 0 },
    Hex: { Code: null },
  };
  Object.assign(settings, options);

  switch (colorSpace) {
    case ColorSpacesTypes.RGB:
      return Rgb.create(settings.Rgb);
    case ColorSpacesTypes.LAB:
      return Lab.create(settings.Lab);
    case ColorSpacesTypes.HEX:
      return new Hex(settings.Hex.Code);
    case ColorSpacesTypes.CMY:
      return Cmy.create(settings.CMYK);
    case ColorSpacesTypes.CMYK:
      return Cmyk.create(settings.CMYK);
    case ColorSpacesTypes.LCH:
      return Lch.create(settings.Lch);
  }
}

// #endregion

// #region ColorSpace
interface IColorSpaceComparison {
  Compare(a: IColorSpace, b: IColorSpace): this;
  ToString(): string;
  ToValue(): number;
}

export enum ColorComparisonsTypes {
  CMC,
  CieDe2000,
  Cie1976,
  Cie94,
}

export function getColorComparison(comparison: ColorComparisonsTypes) {
  switch (comparison) {
    case ColorComparisonsTypes.CMC:
      return new CmcComparison();
    case ColorComparisonsTypes.Cie1976:
      return new Cie1976Comparison();
    case ColorComparisonsTypes.Cie94:
      return new Cie94Comparison();
    case ColorComparisonsTypes.CieDe2000:
      return new CieDe2000Comparison();
  }
}

export class CmcComparison implements IColorSpaceComparison {
  public static DefaultLightness = 2.0;
  public static DefaultChroma = 1.0;

  private readonly _lightness: number;
  private readonly _chroma: number;

  deltaL: number;
  deltaA: number;
  deltaB: number;
  deltaCMC: number;

  public static DistanceDivided(a: number, dividend: number): number {
    const adiv = a / dividend;
    return adiv * adiv;
  }

  constructor(options?: { lightness?: number; chroma?: number }) {
    const defaultSettings = { lightness: CmcComparison.DefaultLightness, chroma: CmcComparison.DefaultChroma };
    const settings = Object.assign(defaultSettings, options);

    this._lightness = settings.lightness;
    this._chroma = settings.chroma;
  }

  Compare(a: IColorSpace, b: IColorSpace): this {
    const aLab = a.To(ColorSpacesTypes.LAB) as Lab;
    const bLab = b.To(ColorSpacesTypes.LAB) as Lab;

    this.deltaL = aLab.L - bLab.L;
    this.deltaA = aLab.A - bLab.A;
    this.deltaB = aLab.B - bLab.B;

    const h = Math.atan2(aLab.B, aLab.A);

    const c1 = Math.sqrt(aLab.A * aLab.A + aLab.B * aLab.B);
    const c2 = Math.sqrt(bLab.A * bLab.A + bLab.B * bLab.B);

    const deltaC = c1 - c2;
    const deltaH = Math.sqrt((aLab.A - bLab.A) * (aLab.A - bLab.A) + (aLab.B - bLab.B) * (aLab.B - bLab.B) - deltaC * deltaC);

    let c1_4 = c1 * c1;
    c1_4 *= c1_4;
    const t = 164 <= h && h <= 345 ? 0.56 + Math.abs(0.2 * Math.cos(h + 168.0)) : 0.36 + Math.abs(0.4 * Math.cos(h + 35.0));

    const f = Math.sqrt(c1_4 / (c1_4 + 1900.0));

    const sL = aLab.L < 16 ? 0.511 : (0.040975 * aLab.L) / (1.0 + 0.01765 * aLab.L);
    const sC = (0.0638 * c1) / (1 + 0.0131 * c1) + 0.638;
    const sH = sC * (f * t + 1 - f);

    const differences = CmcComparison.DistanceDivided(this.deltaL, this._lightness * sL) + CmcComparison.DistanceDivided(deltaC, this._chroma * sC) + CmcComparison.DistanceDivided(deltaH, sH);

    this.deltaCMC = Math.sqrt(differences);
    return this; // .deltaCMC;
  }

  ToValue(): number {
    return this.deltaCMC;
  }

  ToString(): string {
    return `&Delta;CMC: ${this.ToValue().toFixed(2)} <br/> &Delta;L: ${this.deltaL.toFixed(2)} &Delta;A: ${this.deltaA.toFixed(2)} &Delta;B: ${this.deltaB.toFixed(2)}`;
  }
}
export class CieDe2000Comparison implements IColorSpaceComparison {
  CIEDE2000: number;

  Compare(a: IColorSpace, b: IColorSpace): this {
    // Set weighting factors to 1
    const k_L = 1.0;
    const k_C = 1.0;
    const k_H = 1.0;

    // Change Color Space to L*a*b:
    const lab1 = a.To(ColorSpacesTypes.LAB) as Lab;
    const lab2 = b.To(ColorSpacesTypes.LAB) as Lab;

    // Calculate Cprime1, Cprime2, Cabbar
    const c_star_1_ab = Math.sqrt(lab1.A * lab1.A + lab1.B * lab1.B);
    const c_star_2_ab = Math.sqrt(lab2.A * lab2.A + lab2.B * lab2.B);
    const c_star_average_ab = (c_star_1_ab + c_star_2_ab) / 2;
    let c_star_average_ab_pot7 = c_star_average_ab * c_star_average_ab * c_star_average_ab;
    c_star_average_ab_pot7 *= c_star_average_ab_pot7 * c_star_average_ab;

    const G = 0.5 * (1 - Math.sqrt(c_star_average_ab_pot7 / (c_star_average_ab_pot7 + 6103515625))); // 25^7
    const a1_prime = (1 + G) * lab1.A;
    const a2_prime = (1 + G) * lab2.A;

    const C_prime_1 = Math.sqrt(a1_prime * a1_prime + lab1.B * lab1.B);
    const C_prime_2 = Math.sqrt(a2_prime * a2_prime + lab2.B * lab2.B);

    // Angles in Degree.
    const h_prime_1 = ((Math.atan2(lab1.B, a1_prime) * 180) / Math.PI + 360) % 360;
    const h_prime_2 = ((Math.atan2(lab2.B, a2_prime) * 180) / Math.PI + 360) % 360;

    const delta_L_prime = lab2.L - lab1.L;
    const delta_C_prime = C_prime_2 - C_prime_1;

    const h_bar = Math.abs(h_prime_1 - h_prime_2);
    let delta_h_prime;

    if (C_prime_1 * C_prime_2 === 0) {
      delta_h_prime = 0;
    } else {
      if (h_bar <= 180) {
        delta_h_prime = h_prime_2 - h_prime_1;
      } else if (h_bar > 180 && h_prime_2 <= h_prime_1) {
        delta_h_prime = h_prime_2 - h_prime_1 + 360.0;
      } else {
        delta_h_prime = h_prime_2 - h_prime_1 - 360.0;
      }
    }

    const delta_H_prime = 2 * Math.sqrt(C_prime_1 * C_prime_2) * Math.sin((delta_h_prime * Math.PI) / 360);

    // Calculate CIEDE2000
    const L_prime_average = (lab1.L + lab2.L) / 2;
    const C_prime_average = (C_prime_1 + C_prime_2) / 2;

    let h_prime_average;

    if (C_prime_1 * C_prime_2 === 0) {
      h_prime_average = 0;
    } else {
      if (h_bar <= 180) {
        h_prime_average = (h_prime_1 + h_prime_2) / 2;
      } else if (h_bar > 180 && h_prime_1 + h_prime_2 < 360) {
        h_prime_average = (h_prime_1 + h_prime_2 + 360) / 2;
      } else {
        h_prime_average = (h_prime_1 + h_prime_2 - 360) / 2;
      }
    }

    let L_prime_average_minus_50_square = L_prime_average - 50;
    L_prime_average_minus_50_square *= L_prime_average_minus_50_square;

    const S_L = 1 + (0.015 * L_prime_average_minus_50_square) / Math.sqrt(20 + L_prime_average_minus_50_square);
    const S_C = 1 + 0.045 * C_prime_average;
    const T =
      1 - 0.17 * Math.cos(this.DegToRad(h_prime_average - 30)) + 0.24 * Math.cos(this.DegToRad(h_prime_average * 2)) + 0.32 * Math.cos(this.DegToRad(h_prime_average * 3 + 6)) - 0.2 * Math.cos(this.DegToRad(h_prime_average * 4 - 63));

    const S_H = 1 + 0.015 * T * C_prime_average;
    let h_prime_average_minus_275_div_25_square = (h_prime_average - 275) / 25;
    h_prime_average_minus_275_div_25_square *= h_prime_average_minus_275_div_25_square;
    const delta_theta = 30 * Math.exp(-h_prime_average_minus_275_div_25_square);

    let C_prime_average_pot_7 = C_prime_average * C_prime_average * C_prime_average;
    C_prime_average_pot_7 *= C_prime_average_pot_7 * C_prime_average;
    const R_C = 2 * Math.sqrt(C_prime_average_pot_7 / (C_prime_average_pot_7 + 6103515625));

    const R_T = -Math.sin(this.DegToRad(2 * delta_theta)) * R_C;

    const delta_L_prime_div_k_L_S_L = delta_L_prime / (S_L * k_L);
    const delta_C_prime_div_k_C_S_C = delta_C_prime / (S_C * k_C);
    const delta_H_prime_div_k_H_S_H = delta_H_prime / (S_H * k_H);

    const CIEDE2000 = Math.sqrt(
      delta_L_prime_div_k_L_S_L * delta_L_prime_div_k_L_S_L + delta_C_prime_div_k_C_S_C * delta_C_prime_div_k_C_S_C + delta_H_prime_div_k_H_S_H * delta_H_prime_div_k_H_S_H + R_T * delta_C_prime_div_k_C_S_C * delta_H_prime_div_k_H_S_H,
    );

    this.CIEDE2000 = CIEDE2000;
    return this;
  }
  ToString(): string {
    return `CIEDE2000: ${this.CIEDE2000.toFixed(3)}`;
  }
  ToValue(): number {
    return this.CIEDE2000;
  }

  private DegToRad(degrees: number) {
    return (degrees * Math.PI) / 180;
  }
}
export class Cie1976Comparison implements IColorSpaceComparison {
  Cie1976: number;
  static Distance(a: number, b: number) {
    return (a - b) * (a - b);
  }

  Compare(a: IColorSpace, b: IColorSpace): this {
    const col1 = a.To(ColorSpacesTypes.LAB) as Lab;
    const col2 = b.To(ColorSpacesTypes.LAB) as Lab;
    const differences = Cie1976Comparison.Distance(col1.L, col2.L) + Cie1976Comparison.Distance(col1.A, col2.A) + Cie1976Comparison.Distance(col1.B, col2.B);
    this.Cie1976 = Math.sqrt(differences);
    return this;
  }

  ToString(): string {
    return `Cie1976: ${this.Cie1976.toFixed(3)}`;
  }
  ToValue(): number {
    return this.Cie1976;
  }
}
export class Cie94Comparison implements IColorSpaceComparison {
  private constantes: { kl: number; k1: number; k2: number } = { kl: 1.0, k1: 0.45, k2: 0.15 };

  Cie94: number;

  Compare(a: IColorSpace, b: IColorSpace): this {
    const labA = a.To(ColorSpacesTypes.LAB) as Lab;
    const labB = b.To(ColorSpacesTypes.LAB) as Lab;

    const deltaL = labA.L - labB.L;
    const deltaA = labA.A - labB.A;
    const deltaB = labA.B - labB.B;

    const c1 = Math.sqrt(labA.A * labA.A + labA.B * labA.B);
    const c2 = Math.sqrt(labB.A * labB.A + labB.B * labB.B);
    const deltaC = c1 - c2;

    let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);

    const sl = 1.0;
    const kc = 1.0;
    const kh = 1.0;

    const sc = 1.0 + this.constantes.k1 * c1;
    const sh = 1.0 + this.constantes.k2 * c1;

    const deltaLKlsl = deltaL / (this.constantes.kl * sl);
    const deltaCkcsc = deltaC / (kc * sc);
    const deltaHkhsh = deltaH / (kh * sh);
    const i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;

    this.Cie94 = i < 0 ? 0 : Math.sqrt(i);

    return this;
  }
  ToString(): string {
    return `Cie94: ${this.Cie94.toFixed(3)}`;
  }
  ToValue(): number {
    return this.Cie94;
  }
}
/*
public delegate double ComparisonAlgorithm(IColorSpace a, IColorSpace b);
*/

/**
 * Define los metodos publicos para todos los espacios de color
 */
export interface IColorSpace {
  ColorSpaceName?: string;
  /**
   * Inicializa las configuraciones desde un objero Rgb
   * @param color
   */
  initialize?(color: IRgb): IColorSpace;

  /**
   * Convierte el espacio de color a Rgb
   */
  ToRgb?(): IRgb;

  /**
   * Convertir cualquier IColorSpace a cualquier otro IColorSpace.
   * @param C IColorSpace al que se convertira
   */
  To?(colorSpace: ColorSpacesTypes): IColorSpace;

  /**
   * Determina qué tan cerca están dos IColorSpaces entre sí usando un algoritmo dado
   * @param compareToValue Otro IColorSpace para comparar
   * @param comparer Algoritmo a usar para la comparación
   */
  Compare?<T extends IColorSpaceComparison>(compareToValue: IColorSpace, comparer: T): T;

  ToString?(): string;
}

abstract class ColorSpace implements IColorSpace {
  readonly ColorSpaceName: string;
  public abstract initialize(color: IRgb): IColorSpace;
  public abstract ToRgb(): IRgb;
  public abstract ToString(): string;

  constructor(name: string = null) {
    this.ColorSpaceName = name;
  }

  /**
   * Metodo para comparar cualquier color
   * @param compareToValue
   * @param comparer
   * @returns  Devuelve un valor numerico unico que representa la diferencia entre dos colores
   */
  public Compare<T extends IColorSpaceComparison>(compareToValue: IColorSpace, comparer: T): T {
    return comparer.Compare(this, compareToValue);
  }

  /**
   * Convierte cualquier IColorSpace a cualquier otro IColorSpace
   * @param C Debe Implemetar IColorSpace
   * @returns IColorSpace
   */
  public To(color: ColorSpacesTypes): IColorSpace {
    const activeRow = CreateInstanceColorSpace(color);

    if (activeRow.ColorSpaceName === this.ColorSpaceName) {
      return this;
    }

    if (activeRow === undefined) {
      throw new Error('El Espacio de Color al que se convertira es invalido');
    }
    activeRow.initialize(this.ToRgb());
    return activeRow;
  }
}
// #endregion

//#region Cmy
interface ICmy extends IColorSpace {
  C: number;
  M: number;
  Y: number;
}

export class Cmy extends ColorSpace implements ICmy {
  C: number;
  M: number;
  Y: number;
  static create(color: { C: number; M: number; Y: number }): Cmy {
    const toRet = new Cmy();

    toRet.C = color.C;
    toRet.M = color.M;
    toRet.Y = color.Y;

    // Object.assign(toRet, color);
    return toRet;
  }
  public initialize(color: IRgb) {
    CmyConverter.ToColorSpace(color, this);
    return this;
  }
  public ToRgb(): IRgb {
    return CmyConverter.ToColor(this);
  }
  constructor() {
    super('Cmy');
  }

  ToString(): string {
    return `C: ${(this.C * 100).toFixed(0)}% M: ${(this.M * 100).toFixed(0)}% Y: ${(this.Y * 100).toFixed(0)}%`;
  }
}

class CmyConverter {
  static ToColorSpace(color: IRgb, item: ICmy) {
    item.C = 1 - color.R / 255.0;
    item.M = 1 - color.G / 255.0;
    item.Y = 1 - color.B / 255.0;
  }
  static ToColor(item: ICmy): IRgb {
    return Rgb.create({ R: (1 - item.C) * 255.0, G: (1 - item.M) * 255.0, B: (1 - item.Y) * 255.0 });
  }
}
// #endregion

// #region cmyk
export function BasicallyEqualTo(a: number, b: number) {
  return Math.abs(a - b) <= DefaultPrecision;
}

interface ICmyk extends IColorSpace {
  C: number;
  M: number;
  Y: number;
  K: number;
}

export class Cmyk extends ColorSpace implements ICmyk {
  C: number;
  M: number;
  Y: number;
  K: number;
  static create(color: { C: number; M: number; Y: number; K: number }): Cmyk {
    const toRet = new Cmyk();
    Object.assign(toRet, color);
    return toRet;
  }
  public initialize(color: IRgb) {
    CmykConverter.ToColorSpace(CreateInstanceColorSpace(ColorSpacesTypes.RGB, { Rgb: { R: color.R, G: color.G, B: color.B } }) as IRgb, this);
    return this;
  }
  public ToRgb(): IRgb {
    return CmykConverter.ToColor(this);
  }

  constructor() {
    super('Cmyk');
  }

  ToString(): string {
    return `C: ${(this.C * 100).toFixed(0)}% M: ${(this.M * 100).toFixed(0)}% Y: ${(this.Y * 100).toFixed(0)}% K: ${(this.K * 100).toFixed(0)}%`;
  }
}

class CmykConverter {
  static ToColorSpace(color: IRgb, item: ICmyk) {
    const cmy = new Cmy();
    cmy.initialize(color);

    let k = 1.0;
    if (cmy.C < k) {
      k = cmy.C;
    }
    if (cmy.M < k) {
      k = cmy.M;
    }
    if (cmy.Y < k) {
      k = cmy.Y;
    }
    item.K = k;

    if (BasicallyEqualTo(k, 1)) {
      item.C = 0;
      item.M = 0;
      item.Y = 0;
    } else {
      item.C = (cmy.C - k) / (1 - k);
      item.M = (cmy.M - k) / (1 - k);
      item.Y = (cmy.Y - k) / (1 - k);
    }
  }

  static ToColor(item: ICmyk): IRgb {
    const cmy = new Cmy();

    cmy.C = item.C * (1 - item.K) + item.K;
    cmy.M = item.M * (1 - item.K) + item.K;
    cmy.Y = item.Y * (1 - item.K) + item.K;

    return cmy.ToRgb();
  }
}
// #endregion

// #region Hex
interface IHex extends IColorSpace {
  R: string;
  G: string;
  B: string;
  Code: string;
  toString(): string;
}

export class Hex extends ColorSpace implements IHex {
  private _R: string;
  private _G: string;
  private _B: string;

  public get R(): string {
    return this._R;
  }
  public set R(val: string) {
    this._R = SetterCheck(val);
  }

  public get G(): string {
    return this._G;
  }
  public set G(val: string) {
    this._G = SetterCheck(val);
  }

  public get B(): string {
    return this._B;
  }
  public set B(val: string) {
    this._B = SetterCheck(val);
  }

  public get Code(): string {
    return `#${this.R}${this.G}${this.B}`;
  }
  public set Code(val: string) {
    this.SetCode(val);
  }

  private SetCode(value: string) {
    // const regex1 = /^#{0,1}([0-9A-Fa-f]{1})([0-9A-Fa-f]{1})([0-9A-Fa-f]{1})$/g;
    // let m = regex1.exec(value);

    // if (m && m.length > 3) {
    //   this.R = `${m[1]}${m[1]}`; // string.Format("{0}{0}", gp[1]);
    //   this.G = `${m[2]}${m[2]}`; // string.Format("{0}{0}", gp[2]);
    //   this.B = `${m[3]}${m[3]}`; // string.Format("{0}{0}", gp[3]);
    //   return;
    // }

    const regex = /^#{0,1}([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/g;
    const m = regex.exec(value);

    if (m && m.length > 3) {
      this.R = m[1];
      this.G = m[2];
      this.B = m[3];
      return;
    }

    // this.R = '00';
    // this.G = '00';
    // this.B = '00';
  }

  constructor(code: string = null) {
    super('Hex');
    if (code) {
      this.SetCode(code);
    }
  }

  public initialize(color: IRgb) {
    HexConverter.ToColorSpace(CreateInstanceColorSpace(ColorSpacesTypes.RGB, { Rgb: { R: color.R, G: color.G, B: color.B } }) as IRgb, this);
    return this;
  }

  public ToRgb(): IRgb {
    return HexConverter.ToColor(this);
  }

  public ToString(): string {
    return this.Code;
  }
}

class HexConverter {
  static ToColorSpace(color: IRgb, item: IHex) {
    item.R = RoundAwayFromZero(color.R, 0).toString(16);
    item.G = RoundAwayFromZero(color.G, 0).toString(16);
    item.B = RoundAwayFromZero(color.B, 0).toString(16);
  }

  static ToColor(item: IHex): IRgb {
    return Rgb.create({ R: parseInt(item.R, 16), G: parseInt(item.G, 16), B: parseInt(item.B, 16) });
  }
}
// #endregion

// #region Lab
interface ILab extends IColorSpace {
  L: number;
  A: number;
  B: number;
}

export class Lab extends ColorSpace implements ILab {
  L: number;
  A: number;
  B: number;

  static create(color: { L: number; A: number; B: number }): Lab {
    const toRet = new Lab();
    Object.assign(toRet, color);
    return toRet;
  }

  public initialize(color: IRgb) {
    LabConverter.ToColorSpace(CreateInstanceColorSpace(ColorSpacesTypes.RGB, { Rgb: { R: color.R, G: color.G, B: color.B } }) as IRgb, this);
    return this;
  }
  public ToRgb(): IRgb {
    return LabConverter.ToColor(this);
  }
  constructor() {
    super('Lab');
  }

  ToString(): string {
    return `L: ${this.L.toFixed(2)} A: ${this.A.toFixed(2)} B: ${this.B.toFixed(2)}`;
  }
}

class LabConverter {
  static ToColorSpace(color: IRgb, item: ILab) {
    const xyz = new Xyz();
    xyz.initialize(color);
    const white = WhiteReference();

    const x = this.PivotXyz(xyz.X / white.X);
    const y = this.PivotXyz(xyz.Y / white.Y);
    const z = this.PivotXyz(xyz.Z / white.Z);

    item.L = Math.max(0, 116 * y - 16);
    item.A = 500 * (x - y);
    item.B = 200 * (y - z);
  }

  static ToColor(item: ILab): IRgb {
    const y = (item.L + 16.0) / 116.0;
    const x = item.A / 500.0 + y;
    const z = y - item.B / 200.0;

    const white = WhiteReference();
    const x3 = x * x * x;
    const z3 = z * z * z;

    const xyz = new Xyz();

    xyz.X = white.X * (x3 > Epsilon ? x3 : (x - 16.0 / 116.0) / 7.787);
    xyz.Y = white.Y * (item.L > Kappa * Epsilon ? Math.pow((item.L + 16.0) / 116.0, 3) : item.L / Kappa);
    xyz.Z = white.Z * (z3 > Epsilon ? z3 : (z - 16.0 / 116.0) / 7.787);

    return xyz.ToRgb();
  }

  private static PivotXyz(n: number): number {
    return n > Epsilon ? CubicRoot(n) : (Kappa * n + 16) / 116;
  }
}
// #endregion

// #region Lch
interface ILch extends IColorSpace {
  L: number;
  C: number;
  H: number;
}

export class Lch extends ColorSpace implements ILch {
  L: number;
  C: number;
  H: number;

  static create(color: { L: number; C: number; H: number }): Lch {
    const toRet = new Lch();
    Object.assign(toRet, color);
    return toRet;
  }

  public initialize(color: IRgb): this {
    LchConverter.ToColorSpace(CreateInstanceColorSpace(ColorSpacesTypes.RGB, { Rgb: { R: color.R, G: color.G, B: color.B } }) as IRgb, this);
    return this;
  }
  public ToRgb(): IRgb {
    return LchConverter.ToColor(this);
  }
  constructor() {
    super('Lch');
  }

  ToString(): string {
    return `L: ${this.L.toFixed(1)} C: ${this.C.toFixed(1)} H: ${this.H.toFixed(0)}`;
  }
}

class LchConverter {
  static ToColorSpace(color: IRgb, item: ILch) {
    const lab = color.To(ColorSpacesTypes.LAB) as Lab;
    let h = Math.atan2(lab.B, lab.A);

    // convert from radians to degrees
    if (h > 0) {
      h = (h / Math.PI) * 180.0;
    } else {
      h = 360 - (Math.abs(h) / Math.PI) * 180.0;
    }

    if (h < 0) {
      h += 360.0;
    } else if (h >= 360) {
      h -= 360.0;
    }

    item.L = lab.L;
    item.C = Math.sqrt(lab.A * lab.A + lab.B * lab.B);
    item.H = h;
  }
  static ToColor(item: ILch): IRgb {
    const hRadians = (item.H * Math.PI) / 180.0;
    const lab = new Lab();
    lab.L = item.L;
    lab.A = Math.cos(hRadians) * item.C;
    lab.B = Math.sin(hRadians) * item.C;
    return lab.To(ColorSpacesTypes.RGB) as Rgb;
  }
}

// #endregion

// #region Rgb
/**
 * Interface Rgb
 */
export interface IRgb extends IColorSpace {
  R: number;
  G: number;
  B: number;
}

/**
 * Rgb Class
 */
export class Rgb extends ColorSpace implements IRgb {
  /**
   * Color Rojo [0-255]
   */
  R: number;
  /**
   * Color Verde [0-255]
   */
  G: number;
  /**
   * Color Azul [0-255]
   */
  B: number;

  /**
   * Crea una instacia de un espacio de color
   * @param color Valores para el color
   */
  static create(color: { R: number; G: number; B: number }): Rgb {
    const toRet = new Rgb();
    Object.assign(toRet, color);
    return toRet;
  }

  /**
   * Inicializa el color
   */
  public initialize(color: IRgb) {
    RgbConverter.ToColorSpace(CreateInstanceColorSpace(ColorSpacesTypes.RGB, { Rgb: { R: color.R, G: color.G, B: color.B } }) as IRgb, this);
    return this;
  }

  /**
   * Convierte el espacio de color a Rgb
   */
  public ToRgb(): IRgb {
    return RgbConverter.Tocolor(this);
  }
  constructor() {
    super('Rgb');
  }
  ToString(): string {
    return `R: ${this.R.toFixed(2)} G: ${this.G.toFixed(2)} B: ${this.B.toFixed(2)}`;
  }
}

class RgbConverter {
  static ToColorSpace(color: IRgb, item: IRgb) {
    item.R = color.R;
    item.G = color.G;
    item.B = color.B;
  }

  static Tocolor(item: IRgb): IRgb {
    return item;
  }
}
// #endregion

// #region Xyz
interface IXyz extends IColorSpace {
  X: number;
  Y: number;
  Z: number;
}

export class Xyz extends ColorSpace implements IXyz {
  X: number;
  Y: number;
  Z: number;

  static create(color: { X: number; Y: number; Z: number }): Xyz {
    const toRet = new Xyz();
    Object.assign(toRet, color);
    return toRet;
  }

  public initialize(color: IRgb) {
    XyzConverter.ToColorSpace(CreateInstanceColorSpace(ColorSpacesTypes.RGB, { Rgb: { R: color.R, G: color.G, B: color.B } }) as IRgb, this);
    return this;
  }
  public ToRgb(): IRgb {
    return XyzConverter.ToColor(this);
  }
  constructor() {
    super('Xyz');
  }
  ToString(): string {
    return `X: ${this.X.toFixed(2)} Y: ${this.Y.toFixed(2)} Z: ${this.Z.toFixed(2)}`;
  }
}

class XyzConverter {
  static ToColorSpace(color: IRgb, item: IXyz) {
    const r = this.PivotRgb(color.R / 255.0);
    const g = this.PivotRgb(color.G / 255.0);
    const b = this.PivotRgb(color.B / 255.0);

    // Observer. = 2°, Illuminant = D65
    item.X = r * 0.4124 + g * 0.3576 + b * 0.1805;
    item.Y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    item.Z = r * 0.0193 + g * 0.1192 + b * 0.9505;
  }

  static ToColor(item: IXyz): IRgb {
    const x = item.X / 100.0;
    const y = item.Y / 100.0;
    const z = item.Z / 100.0;

    let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    let b = x * 0.0557 + y * -0.204 + z * 1.057;

    r = this.getValue(r);
    g = this.getValue(g);
    b = this.getValue(b);

    return Rgb.create({ R: r, G: g, B: b });
  }

  private static getValue(value: number): number {
    const n = value > 0.0031308 ? 1.055 * Math.pow(value, 1 / 2.4) - 0.055 : 12.92 * value;
    const result = 255.0 * n;

    switch (true) {
      case result <= 0:
        return 0;
      case result >= 255:
        return 255;
      default:
        return result;
    }
  }

  private static PivotRgb(n: number): number {
    return (n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92) * 100.0;
  }
}
// #endregion
