import xml.etree.ElementTree as ET

def generar_svg_altimetria(archivo_xml, archivo_svg):
    # Cargar el archivo XML
    tree = ET.parse(archivo_xml)
    root = tree.getroot()

    # Espacio de nombres XML
    ns = {'ns': 'http://www.uniovi.es'}

    puntos = [] # Lista de tuplas: (distancia, altitud)

    # --- EXPRESIONES XPATH ---
    # 1. Salida (0 km)
    salida = root.find('./ns:salida', ns)
    lugar_salida = salida.find('./ns:lugar', ns).text if salida is not None else "Salida"
    if salida is not None:
        altitud_salida = float(salida.find('.//ns:altitud', ns).text)
        puntos.append((0.0, altitud_salida))

    # 2. Hitos (Sprints, Puertos, Puntos Anónimos)
    for hito in root.findall('./ns:hitos/*', ns):
        dist_elem = hito.find('./ns:distanciaDesdeSalida', ns)
        alt_elem = hito.find('.//ns:altitud', ns)

        if dist_elem is not None and alt_elem is not None:
            puntos.append((float(dist_elem.text), float(alt_elem.text)))

    # 3. Llegada / Meta
    longitud_elem = root.find('./ns:longitud', ns)
    llegada = root.find('./ns:llegada', ns)
    lugar_llegada = llegada.find('./ns:lugar', ns).text if llegada is not None else "Meta"
    if longitud_elem is not None and llegada is not None:
        dist_llegada = float(longitud_elem.text)
        altitud_llegada = float(llegada.find('.//ns:altitud', ns).text)
        puntos.append((dist_llegada, altitud_llegada))

    # Ordenar los puntos por distancia acumulada
    puntos.sort(key=lambda p: p[0])

    distancias = [p[0] for p in puntos]
    altitudes = [p[1] for p in puntos]

    # Dimensiones del lienzo SVG
    ancho_svg = 800
    alto_svg = 450
    margen = 60

    # Mínimos y máximos para la escala
    max_distancia = max(distancias) if distancias else 1
    min_altitud = min(altitudes) if altitudes else 0
    max_altitud = max(altitudes) if altitudes else 1

    rango_altitud = max_altitud - min_altitud
    if rango_altitud == 0:
        rango_altitud = 1

    # Factores de escala
    escala_x = (ancho_svg - 2 * margen) / max_distancia
    escala_y = (alto_svg - 2 * margen) / rango_altitud

    # Mapeo a coordenadas del canvas SVG
    puntos_svg = []
    for d, a in zip(distancias, altitudes):
        x = margen + d * escala_x
        y = (alto_svg - margen) - ((a - min_altitud) * escala_y)
        puntos_svg.append((x, y))

    y_base_eje = alto_svg - margen

    # Inicio de construcción del documento SVG
    svg_content = f'<svg width="{ancho_svg}" height="{alto_svg}" xmlns="http://www.w3.org/2000/svg">\n'

    # Polilínea del perfil altimétrico
    puntos_polyline_str = " ".join([f"{x:.2f},{y:.2f}" for x, y in puntos_svg])
    svg_content += f'  <polyline points="{puntos_polyline_str}" style="fill:none;stroke:red;stroke-width:2"/>\n'

    x_salida, y_salida = puntos_svg[0]
    svg_content += f'  <!-- Salida: Línea vertical -->\n'
    svg_content += f'  <line x1="{x_salida:.2f}" y1="{y_base_eje}" x2="{x_salida:.2f}" y2="{y_salida:.2f}" stroke="red" stroke-width="1.5" stroke-dasharray="3,3"/>\n'

    # Texto en vertical al lado de la línea de inicio
    svg_content += f'  <text x="{x_salida + 15:.2f}" y="{(y_salida + y_base_eje) / 2:.2f}" font-family="Arial" font-size="12" fill="red" font-weight="bold" transform="rotate(-90, {x_salida + 15:.2f}, {(y_salida + y_base_eje) / 2:.2f})" text-anchor="middle">Salida: {lugar_salida}</text>\n'

    x_meta, y_meta = puntos_svg[-1]
    svg_content += f'  <!-- Meta: Línea vertical -->\n'
    svg_content += f'  <line x1="{x_meta:.2f}" y1="{y_base_eje}" x2="{x_meta:.2f}" y2="{y_meta:.2f}" stroke="red" stroke-width="1.5" stroke-dasharray="3,3"/>\n'

    # Texto en vertical al lado de la línea de final
    svg_content += f'  <text x="{x_meta - 10:.2f}" y="{(y_meta + y_base_eje) / 2:.2f}" font-family="Arial" font-size="12" fill="red" font-weight="bold" transform="rotate(-90, {x_meta - 10:.2f}, {(y_meta + y_base_eje) / 2:.2f})" text-anchor="middle">Llegada: {lugar_llegada}</text>\n'

    # Ejes X e Y
    svg_content += f'  <!-- Eje X (Distancia) -->\n'
    svg_content += f'  <line x1="{margen}" y1="{y_base_eje}" x2="{ancho_svg-margen}" y2="{y_base_eje}" stroke="black" stroke-width="1.5"/>\n'
    svg_content += f'  <!-- Eje Y (Altitud) -->\n'
    svg_content += f'  <line x1="{margen}" y1="{y_base_eje}" x2="{margen}" y2="{margen}" stroke="black" stroke-width="1.5"/>\n'

    svg_content += '</svg>'

    # Guardar archivo
    with open(archivo_svg, 'w', encoding='utf-8') as f:
        f.write(svg_content)

    print(f"Archivo SVG generado correctamente: {archivo_svg}")

if __name__ == '__main__':
    generar_svg_altimetria('etapaEsquema.xml', 'altimetria.svg')