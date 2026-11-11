"""Genera las ilustraciones SVG de la demo: un frasco de 100 ml y un vial (decant) por perfume.

Son dibujos propios (no fotos de las marcas). En la tienda real se reemplazan por fotos del dueño.
Uso: python tools/frascos.py   (escribe en img/perfumes/)
"""
from pathlib import Path

SALIDA = Path(__file__).resolve().parent.parent / "img" / "perfumes"

# id, nombre corto, color del frasco, color del líquido/brillo, forma, fondo (dos tonos)
PERFUMES = [
    ("khamrah", "KHAMRAH", "#6b3410", "#c9772c", "torre", ("#f3e3cf", "#e2c39d")),
    ("asad", "ASAD", "#141414", "#3a3a3a", "facetado", ("#efe6d6", "#d8c6a5")),
    ("fakhar", "FAKHAR", "#1f2a44", "#4d6290", "facetado", ("#e6e9f0", "#c3cad9")),
    ("cdn-intense", "CLUB DE NUIT", "#1d1d1f", "#454549", "torre", ("#ebe7e1", "#cfc8bd")),
    ("hawas", "HAWAS", "#2f6ea5", "#7fb3df", "redondo", ("#e3eef7", "#bfd6ea")),
    ("9pm", "9PM", "#24192f", "#5b3f78", "facetado", ("#ece5f1", "#d3c4e0")),
    ("oud-glory", "OUD FOR GLORY", "#1c2620", "#3d5446", "torre", ("#e6ebe4", "#c6d1c2")),
    ("amber-oud", "AMBER OUD", "#9a6418", "#e0a94a", "redondo", ("#f6ead2", "#e5cc9b")),
]

ORO = ("#f6dc96", "#c9973f", "#8a6420")


def fondo(id_, tonos):
    claro, oscuro = tonos
    return f"""
  <defs>
    <radialGradient id="f-{id_}" cx="50%" cy="38%" r="75%">
      <stop offset="0" stop-color="{claro}"/><stop offset="1" stop-color="{oscuro}"/>
    </radialGradient>
    <linearGradient id="oro-{id_}" x1="0" x2="1">
      <stop offset="0" stop-color="{ORO[2]}"/><stop offset=".45" stop-color="{ORO[0]}"/><stop offset="1" stop-color="{ORO[1]}"/>
    </linearGradient>
    <linearGradient id="brillo-{id_}" x1="0" x2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".2" stop-color="#fff" stop-opacity=".35"/>
      <stop offset=".32" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#f-{id_})"/>
  <ellipse cx="300" cy="512" rx="170" ry="18" fill="#000" opacity=".12"/>"""


def cuerpo(forma, color, brillo, id_):
    """Devuelve (svg del cuerpo, y superior del cuerpo, centro y de la etiqueta)."""
    if forma == "torre":
        return (f'<rect x="205" y="210" width="190" height="300" rx="22" fill="{color}"/>'
                f'<rect x="219" y="224" width="162" height="272" rx="14" fill="{brillo}" opacity=".35"/>'
                f'<rect x="205" y="210" width="190" height="300" rx="22" fill="url(#brillo-{id_})"/>', 210, 370)
    if forma == "redondo":
        return (f'<path d="M300 205c-95 0-130 60-130 150s40 155 130 155 130-65 130-155-35-150-130-150z" fill="{color}"/>'
                f'<path d="M300 225c-78 0-108 50-108 130s34 135 108 135 108-55 108-135-30-130-108-130z" fill="{brillo}" opacity=".35"/>'
                f'<path d="M300 205c-95 0-130 60-130 150s40 155 130 155 130-65 130-155-35-150-130-150z" fill="url(#brillo-{id_})"/>', 205, 370)
    # facetado (octógono)
    return (f'<path d="M240 210h120l55 55v190l-55 55H240l-55-55V265z" fill="{color}"/>'
            f'<path d="M248 228h104l45 45v174l-45 45H248l-45-45V273z" fill="{brillo}" opacity=".35"/>'
            f'<path d="M240 210h120l55 55v190l-55 55H240l-55-55V265z" fill="url(#brillo-{id_})"/>', 210, 372)


def frasco(id_, nombre, color, brillo, forma, tonos):
    cuerpo_svg, arriba, y_etq = cuerpo(forma, color, brillo, id_)
    tam = 26 if len(nombre) <= 7 else 19
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img" aria-label="Frasco de {nombre.title()} 100 ml">{fondo(id_, tonos)}
  <rect x="268" y="{arriba - 34}" width="64" height="38" rx="6" fill="url(#oro-{id_})"/>
  <rect x="246" y="{arriba - 112}" width="108" height="82" rx="16" fill="url(#oro-{id_})"/>
  <rect x="258" y="{arriba - 104}" width="18" height="66" rx="9" fill="#fff" opacity=".35"/>
  {cuerpo_svg}
  <rect x="222" y="{y_etq - 34}" width="156" height="68" rx="8" fill="#fbf6ec" stroke="url(#oro-{id_})" stroke-width="3"/>
  <text x="300" y="{y_etq + 4}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="{tam}" letter-spacing="2" fill="#2a2016">{nombre}</text>
  <text x="300" y="{y_etq + 24}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" letter-spacing="3" fill="#8a6420">100 ML · EDP</text>
</svg>
"""


def vial(id_, nombre, color, brillo, ml, tonos):
    alto = 250 if ml == 10 else 200
    arriba = 470 - alto
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600" role="img" aria-label="Decant de {nombre.title()} {ml} ml">{fondo(id_, tonos)}
  <rect x="270" y="{arriba - 58}" width="60" height="62" rx="10" fill="url(#oro-{id_})"/>
  <rect x="278" y="{arriba - 50}" width="12" height="46" rx="6" fill="#fff" opacity=".4"/>
  <rect x="262" y="{arriba}" width="76" height="{alto + 40}" rx="16" fill="#ffffff" opacity=".55" stroke="#ffffff" stroke-width="3"/>
  <rect x="270" y="{arriba + 40}" width="60" height="{alto - 8}" rx="10" fill="{brillo}"/>
  <rect x="270" y="{arriba + 40}" width="60" height="{alto - 8}" rx="10" fill="{color}" opacity=".55"/>
  <rect x="262" y="{arriba}" width="76" height="{alto + 40}" rx="16" fill="url(#brillo-{id_})"/>
  <rect x="226" y="{arriba + alto / 2 - 4}" width="148" height="56" rx="8" fill="#fbf6ec" stroke="url(#oro-{id_})" stroke-width="3"/>
  <text x="300" y="{arriba + alto / 2 + 22}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="{17 if len(nombre) <= 7 else 13}" letter-spacing="1.5" fill="#2a2016">{nombre}</text>
  <text x="300" y="{arriba + alto / 2 + 41}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" letter-spacing="3" fill="#8a6420">DECANT {ml} ML</text>
</svg>
"""


def main():
    SALIDA.mkdir(parents=True, exist_ok=True)
    for id_, nombre, color, brillo, forma, tonos in PERFUMES:
        (SALIDA / f"{id_}.svg").write_text(frasco(id_, nombre, color, brillo, forma, tonos), encoding="utf-8")
        for ml in (10, 5):
            (SALIDA / f"{id_}-decant-{ml}.svg").write_text(vial(f"{id_}{ml}", nombre, color, brillo, ml, tonos), encoding="utf-8")
    print(f"{len(PERFUMES) * 3} ilustraciones en {SALIDA}")


if __name__ == "__main__":
    main()
