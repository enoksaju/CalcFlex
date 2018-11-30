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
  XYZ,
}
export interface IConverters {
  rgb: Rgb;
  lab: Lab;
  xyz: Xyz;
  cmy: Cmy;
  cmyk: Cmyk;
  lch: Lch;
  hex: Hex;
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
    case ColorSpacesTypes.XYZ:
      return Xyz.create(settings.Xyz);
  }
}

// #endregion

// #region ColorSpace
export interface IColorSpaceComparison {
  Compare(a: IColorSpace, b: IColorSpace): number;
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
  Compare?(compareToValue: IColorSpace, comparer: IColorSpaceComparison): number;

  ToString?(): string;
}

export abstract class ColorSpace implements IColorSpace {
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
  public Compare(compareToValue: IColorSpace, comparer: IColorSpaceComparison): number {
    return comparer.Compare(this, compareToValue);
  }

  /**
   * Convierte cualquier IColorSpace a cualquier otro IColorSpace
   * @param C Debe Implemetar IColorSpace
   * @returns IColorSpace
   */
  public To(color: ColorSpacesTypes): IColorSpace {
    const activeRow = CreateInstanceColorSpace(color);

    if (activeRow === undefined) {
      throw new Error('El Espacio de Color al que se convertira es invalido');
    }

    activeRow.initialize(this.ToRgb());
    return activeRow;
  }
}
// #endregion

//#region Cmy
export interface ICmy extends IColorSpace {
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
    return `C: ${this.C.toFixed(2)} M: ${this.M.toFixed(2)} Y: ${this.Y.toFixed(2)}`;
  }
}

export class CmyConverter {
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
  return Math.abs(this - b) <= DefaultPrecision;
}

export interface ICmyk extends IColorSpace {
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
    return `C: ${this.C.toFixed(2)} M: ${this.M.toFixed(2)} Y: ${this.Y.toFixed(2)} K: ${this.K.toFixed(2)}`;
  }
}

export class CmykConverter {
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
export interface IHex extends IColorSpace {
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
    const regex1 = /^#{0,1}([0-9A-Fa-f]{1})([0-9A-Fa-f]{1})([0-9A-Fa-f]{1})$/g;
    let m = regex1.exec(value);

    if (regex1.test(value)) {
      this.R = `${m[1]}${m[1]}`; // string.Format("{0}{0}", gp[1]);
      this.G = `${m[2]}${m[2]}`; // string.Format("{0}{0}", gp[2]);
      this.B = `${m[2]}${m[2]}`; // string.Format("{0}{0}", gp[3]);
      return;
    }

    const regex2 = /^#{0,1}([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/g;

    m = regex2.exec(value);
    if (regex2.test(value)) {
      this.R = m[1];
      this.G = m[2];
      this.B = m[3];
      return;
    }

    throw new Error('Error de Formato');
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

export class HexConverter {
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
export interface ILab extends IColorSpace {
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

export class LabConverter {
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
export interface ILch extends IColorSpace {
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
    return `L: ${this.L.toFixed(2)} C: ${this.C.toFixed(2)} H: ${this.H.toFixed(2)}`;
  }
}

export class LchConverter {
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

export class RgbConverter {
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
export interface IXyz extends IColorSpace {
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

export class XyzConverter {
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
