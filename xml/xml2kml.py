import xml.etree.ElementTree as ET

def obtener_coord_info(elem_coordenadas, ns):
    """Extrae las coordenadas numéricas y devuelve el string 'lon,lat,alt' y la latitud/longitud en float."""
    lon_str = elem_coordenadas.find('ns:longitudGeografica', ns).text.strip()
    lat_str = elem_coordenadas.find('ns:latitud', ns).text.strip()
    alt_str = elem_coordenadas.find('ns:altitud', ns).text.strip()
    return f"{lon_str},{lat_str},{alt_str}", float(lon_str), float(lat_str), float(alt_str)

def crear_kml(xml_file, kml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    ns = {'ns': 'http://www.uniovi.es'}

    nombre_etapa = root.find('ns:nombre', ns).text
    coordenadas_linea = []
    placemarks_xml = []

    # 1. Punto de Salida (Rojo)
    salida = root.find('ns:salida', ns)
    if salida is not None:
        lugar = salida.find('ns:lugar', ns).text
        coord_elem = salida.find('ns:coordenadas', ns)
        coord_str, lon, lat, alt = obtener_coord_info(coord_elem, ns)
        coordenadas_linea.append(coord_str)

        placemarks_xml.append(f"""
    <Placemark>
      <name>Salida: {lugar} (KM 0)</name>
      <styleUrl>#redPin</styleUrl>
      <Point>
        <coordinates>{coord_str}</coordinates>
      </Point>
    </Placemark>""")

    # 2. Hitos (Puertos de montaña, Sprints y Puntos con Kilometraje)
    for hito in root.findall('.//ns:hitos/*', ns):
        tag_name = hito.tag.replace('{http://www.uniovi.es}', '')
        coord_elem = hito.find('ns:coordenadas', ns)
        dist_elem = hito.find('ns:distanciaDesdeSalida', ns)

        dist_texto = f" (KM {dist_elem.text})" if dist_elem is not None else ""

        if coord_elem is not None:
            coord_str, lon, lat, alt = obtener_coord_info(coord_elem, ns)
            coordenadas_linea.append(coord_str)

            nombre_elem = hito.find('ns:nombre', ns)
            nombre_hito = nombre_elem.text if nombre_elem is not None else ""

            if tag_name == 'puertoMontana':
                style_id = "#greenPin"
                titulo = f"Puerto: {nombre_hito}{dist_texto}"
                coord_placemark = coord_str
            elif tag_name in ['sprintIntermedio', 'sprintBonificado']:
                style_id = "#bluePin"
                titulo = f"Sprint: {nombre_hito}{dist_texto}"
                # Desplazamiento leve (~10 metros) para evitar solapamiento visual con la Meta
                coord_placemark = f"{lon},{lat + 0.00010},{alt}"
            else:  # puntoAnonimo -> Mostrar directamente el KM
                style_id = "#yellowPin"
                titulo = f"KM {dist_elem.text}" if dist_elem is not None else "Punto Intermedio"
                coord_placemark = coord_str

            placemarks_xml.append(f"""
    <Placemark>
      <name>{titulo}</name>
      <styleUrl>{style_id}</styleUrl>
      <Point>
        <coordinates>{coord_placemark}</coordinates>
      </Point>
    </Placemark>""")

    # 3. Punto de Llegada / Meta (Rojo)
    llegada = root.find('ns:llegada', ns)
    if llegada is not None:
        lugar = llegada.find('ns:lugar', ns).text
        coord_elem = llegada.find('ns:coordenadas', ns)
        coord_str, lon, lat, alt = obtener_coord_info(coord_elem, ns)
        coordenadas_linea.append(coord_str)

        longitud_elem = root.find('ns:longitud', ns)
        km_meta = f" (KM {longitud_elem.text})" if longitud_elem is not None else ""

        placemarks_xml.append(f"""
    <Placemark>
      <name>Meta: {lugar}{km_meta}</name>
      <styleUrl>#redPin</styleUrl>
      <Point>
        <coordinates>{coord_str}</coordinates>
      </Point>
    </Placemark>""")

    coords_linea_formatted = "\n          ".join(coordenadas_linea)
    placemarks_str = "\n".join(placemarks_xml)

    kml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>{nombre_etapa}</name>

    <!-- Estilo para la línea del recorrido -->
    <Style id="redLine">
      <LineStyle>
        <color>ff0000ff</color>
        <width>4</width>
      </LineStyle>
    </Style>

    <!-- Estilo Rojo: Salida y Meta -->
    <Style id="redPin">
      <IconStyle>
        <color>ff0000ff</color>
        <scale>1.1</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png</href>
        </Icon>
      </IconStyle>
    </Style>

    <!-- Estilo Verde: Puertos de Montaña -->
    <Style id="greenPin">
      <IconStyle>
        <color>ff008000</color>
        <scale>1.1</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png</href>
        </Icon>
      </IconStyle>
    </Style>

    <!-- Estilo Azul: Sprints Intermedios -->
    <Style id="bluePin">
      <IconStyle>
        <color>ffff0000</color>
        <scale>1.1</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/pushpin/blue-pushpin.png</href>
        </Icon>
      </IconStyle>
    </Style>

    <!-- Estilo Amarillo: Puntos con Kilometraje -->
    <Style id="yellowPin">
      <IconStyle>
        <color>ff00ffff</color>
        <scale>0.9</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
        </Icon>
      </IconStyle>
    </Style>

    <!-- Trazado de la ruta (clampToGround para evitar muros 3D) -->
    <Placemark>
      <name>Ruta de la Etapa</name>
      <styleUrl>#redLine</styleUrl>
      <LineString>
        <tessellate>1</tessellate>
        <altitudeMode>relativeToGround</altitudeMode>
        <coordinates>
          {coords_linea_formatted}
        </coordinates>
      </LineString>
    </Placemark>
{placemarks_str}
  </Document>
</kml>
"""

    with open(kml_file, 'w', encoding='utf-8') as f:
        f.write(kml_content)

    print(f"Archivo KML actualizado generado con éxito: {kml_file}")

if __name__ == '__main__':
    crear_kml('etapaEsquema.xml', 'etapa.kml')