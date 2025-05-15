--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tiger; Type: SCHEMA; Schema: -; Owner: map_user
--

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'tiger') THEN
    CREATE SCHEMA tiger;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'tiger_data') THEN
    CREATE SCHEMA tiger_data;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'topology') THEN
    CREATE SCHEMA topology;
  END IF;
END $$;


ALTER SCHEMA tiger OWNER TO map_user;

--
-- Name: tiger_data; Type: SCHEMA; Schema: -; Owner: map_user
--


ALTER SCHEMA tiger_data OWNER TO map_user;

--
-- Name: topology; Type: SCHEMA; Schema: -; Owner: map_user
--


ALTER SCHEMA topology OWNER TO map_user;

--
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: map_user
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: postgis_tiger_geocoder; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;


--
-- Name: EXTENSION postgis_tiger_geocoder; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_tiger_geocoder IS 'PostGIS tiger geocoder and reverse geocoder';


--
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


--
-- Name: location_type; Type: TYPE; Schema: public; Owner: map_user
--

CREATE TYPE public.location_type AS ENUM (
    'food',
    'nature',
    'sights',
    'city',
    'books'
);


ALTER TYPE public.location_type OWNER TO map_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: locations; Type: TABLE; Schema: public; Owner: map_user
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    name text NOT NULL,
    location_type public.location_type NOT NULL,
    description text,
    longitude double precision NOT NULL,
    latitude double precision NOT NULL
);


ALTER TABLE public.locations OWNER TO map_user;

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: map_user
--

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.locations_id_seq OWNER TO map_user;

--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: map_user
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: map_user
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: map_user
--

INSERT INTO public.locations (id, name, location_type, description, longitude, latitude) VALUES
(3, 'Zurich', 'city', 'The largest city in Switzerland.<br><a href=''https://en.wikipedia.org/wiki/Zurich'' target=''_blank''>Read more</a>', 8.5417, 47.3769),
(4, 'Bergen', 'city', 'The second-largest city in Norway.<br><a href=''https://en.wikipedia.org/wiki/Bergen'' target=''_blank''>Read more</a>', 5.3167, 60.4),
(5, 'Ler Devagar', 'books', 'One of the 10 most beautiful bookstores.<br><a href=''https://lerdevagar.com/en/historia/'' target=''_blank''>Read more</a>', -9.1786, 38.7035),
(6, 'Livraria Lello', 'books', 'A bookstore in Porto, Portugal.<br><a href=''https://en.wikipedia.org/wiki/Livraria_Lello'' target=''_blank''>Read more</a>', -8.6149, 41.1466),
(7, 'Madeira', 'city', 'A beautiful region of Portugal.<br><a href=''https://en.wikipedia.org/wiki/Madeira'' target=''_blank''>Read more</a>', -16.9595, 32.7607),
(8, 'Pico Ruivo', 'nature', 'The highest peak on Madeira Island.<br><a href=''https://en.wikipedia.org/wiki/Pico_Ruivo'' target=''_blank''>Read more</a>', -16.9330, 32.7552),
(9, 'Pico do Areeiro', 'nature', 'A mountain in Madeira.<br><a href=''https://en.wikipedia.org/wiki/Pico_do_Areeiro'' target=''_blank''>Read more</a>', -16.9280, 32.7355),
(10, 'Positano', 'city', 'A small village in Italy.<br><a href=''https://en.wikipedia.org/wiki/Positano'' target=''_blank''>Read more</a>', 14.4842, 40.6281),
(11, 'Cărturești Carusel', 'books', 'A bookstore in Romania.<br><a href=''https://en.wikipedia.org/wiki/C%C4%83rture%C8%99ti_Carusel'' target=''_blank''>Read more</a>', 26.1030, 44.4310),
(12, 'Ronnie Scott''s', 'food', 'A famous jazz club in London.<br><a href=''https://en.wikipedia.org/wiki/Ronnie_Scott%27s_Jazz_Club'' target=''_blank''>Read more</a>', -0.1317, 51.5136),
(13, 'Shaftesbury', 'city', 'A historic hilltop town in Dorset, England.<br><a href=''https://en.wikipedia.org/wiki/Shaftesbury'' target=''_blank''>Read more</a>', -2.1969, 51.0053),
(14, 'Clovelly', 'city', 'A village in Devon, England.<br><a href=''https://en.wikipedia.org/wiki/Clovelly'' target=''_blank''>Read more</a>', -4.3991, 51.0036),
(15, 'Cotswolds', 'city', 'A rural area in south-central England.<br><a href=''https://en.wikipedia.org/wiki/Cotswolds'' target=''_blank''>Read more</a>', -1.7782, 51.8333),
(16, 'Roti King Spitalfields', 'food', 'A Malaysian street food restaurant in London.<br><a href=''https://rotiking.com/'' target=''_blank''>Read more</a>', -0.0756, 51.5196),
(17, 'Finchingfield', 'city', 'A village in Essex, England.<br><a href=''https://en.wikipedia.org/wiki/Finchingfield'' target=''_blank''>Read more</a>', 0.4331, 51.9717),
(18, 'Savannah, Georgia', 'city', 'A historic city in the U.S. state of Georgia.<br><a href=''https://en.wikipedia.org/wiki/Savannah,_Georgia'' target=''_blank''>Read more</a>', -81.0998, 32.0809),
(19, 'Jackson, Mississippi', 'city', 'The capital and largest city of Mississippi, USA.<br><a href=''https://en.wikipedia.org/wiki/Jackson,_Mississippi'' target=''_blank''>Read more</a>', -90.1848, 32.2988),
(20, 'Charleston, South Carolina', 'city', 'A historic city in South Carolina.<br><a href=''https://en.wikipedia.org/wiki/Charleston,_South_Carolina'' target=''_blank''>Read more</a>', -79.9311, 32.7765),
(21, 'San Antonio', 'city', 'A city in Texas.<br><a href=''https://en.wikipedia.org/wiki/San_Antonio'' target=''_blank''>Read more</a>', -98.4936, 29.4241),
(22, 'New Orleans', 'city', 'A Louisiana city on the Mississippi River.<br><a href=''https://en.wikipedia.org/wiki/New_Orleans'' target=''_blank''>Read more</a>', -90.0715, 29.9511),
(23, 'Austin', 'city', 'The capital of Texas.<br><a href=''https://en.wikipedia.org/wiki/Austin,_Texas'' target=''_blank''>Read more</a>', -97.7431, 30.2672),
(24, 'Acadia National Park', 'nature', 'A national park located in Maine, USA.<br><a href=''https://en.wikipedia.org/wiki/Acadia_National_Park'' target=''_blank''>Read more</a>', -68.2733, 44.3386),
(25, 'Antelope Canyon', 'nature', 'A famous canyon in Arizona.<br><a href=''https://en.wikipedia.org/wiki/Antelope_Canyon'' target=''_blank''>Read more</a>', -111.3667, 36.8619),
(26, 'Antelope Valley', 'city', 'A region in the western Mojave Desert of California.<br><a href=''https://en.wikipedia.org/wiki/Antelope_Valley'' target=''_blank''>Read more</a>', -118.2, 34.7),
(27, 'Apostle Islands National Lakeshore', 'nature', 'A group of islands in Lake Superior, Wisconsin.<br><a href=''https://en.wikipedia.org/wiki/Apostle_Islands_National_Lakeshore'' target=''_blank''>Read more</a>', -90.7333, 46.9333),
(28, 'Badlands National Park', 'nature', 'A national park in South Dakota.<br><a href=''https://en.wikipedia.org/wiki/Badlands_National_Park'' target=''_blank''>Read more</a>', -102.5000, 43.7500),
(29, 'Bonneville Salt Flats', 'nature', 'A densely packed salt pan in Utah.<br><a href=''https://en.wikipedia.org/wiki/Bonneville_Salt_Flats'' target=''_blank''>Read more</a>', -113.9000, 40.7500),
(30, 'Blue Ridge Parkway', 'nature', 'A highway through the Appalachian Highlands.<br><a href=''https://en.wikipedia.org/wiki/Blue_Ridge_Parkway'' target=''_blank''>Read more</a>', -79.0, 36.0),
(31, 'Crater Lake', 'nature', 'A lake in Oregon formed within a sunken volcano.<br><a href=''https://en.wikipedia.org/wiki/Crater_Lake'' target=''_blank''>Read more</a>', -122.1, 42.9),
(32, 'Denali National Park and Preserve', 'nature', 'A park in Alaska home to North America''s tallest peak.<br><a href=''https://en.wikipedia.org/wiki/Denali_National_Park_and_Preserve'' target=''_blank''>Read more</a>', -150.5, 63.3),
(33, 'Grand Prismatic Spring', 'nature', 'The largest hot spring in the United States, in Yellowstone.<br><a href=''https://en.wikipedia.org/wiki/Grand_Prismatic_Spring'' target=''_blank''>Read more</a>', -110.7927, 44.5250),
(34, 'Grinter Sunflower Farms', 'nature', 'A popular sunflower field in Kansas.<br><a href=''https://www.explorelawrence.com/things-to-do/farms-agriculture/grinters-sunflower-farm/'' target=''_blank''>Read more</a>', -95.0217, 39.0886),
(35, 'Hamilton Pool', 'nature', 'A natural swimming hole near Austin, Texas.<br><a href=''https://en.wikipedia.org/wiki/Hamilton_Pool_Preserve'' target=''_blank''>Read more</a>', -98.1277, 30.3426),
(36, 'Hanging Lake', 'nature', 'A lake in Colorado known for its beauty and waterfalls.<br><a href=''https://en.wikipedia.org/wiki/Hanging_Lake'' target=''_blank''>Read more</a>', -107.1886, 39.5980),
(37, 'Kenai Fjords National Park', 'nature', 'A national park in Alaska with fjords and glaciers.<br><a href=''https://en.wikipedia.org/wiki/Kenai_Fjords_National_Park'' target=''_blank''>Read more</a>', -149.6503, 59.9170),
(38, 'Letchworth State Park', 'nature', 'Known as the "Grand Canyon of the East", located in New York.<br><a href=''https://en.wikipedia.org/wiki/Letchworth_State_Park'' target=''_blank''>Read more</a>', -77.9975, 42.5846),
(39, 'Lake Tahoe - Nevada State Park', 'nature', 'A section of Lake Tahoe on the Nevada side.<br><a href=''https://en.wikipedia.org/wiki/Lake_Tahoe%E2%80%93Nevada_State_Park'' target=''_blank''>Read more</a>', -119.9402, 39.1732),
(40, 'Martha''s Vineyard', 'nature', 'An island south of Cape Cod, Massachusetts, known for its beaches and lighthouses.<br><a href=''https://en.wikipedia.org/wiki/Martha%27s_Vineyard'' target=''_blank''>Read more</a>', -70.6170, 41.4000),
(41, 'Castner Glacier Ice Cave', 'nature', 'A glacier cave located in the eastern Alaska Range, accessible via the Richardson Highway.<br><a href=''https://www.blm.gov/visit/castner-glacier-trail'' target=''_blank''>Read more</a>', -145.7355, 63.4039),
(42, 'Mono Lake', 'nature', 'A saline soda lake in Mono County, California, known for its tufa towers.<br><a href=''https://en.wikipedia.org/wiki/Mono_Lake'' target=''_blank''>Read more</a>', -119.0093, 38.0165),
(43, 'Palouse', 'nature', 'A region of rolling hills in the northwestern United States, primarily in southeastern Washington.<br><a href=''https://en.wikipedia.org/wiki/Palouse'' target=''_blank''>Read more</a>', -117.1600, 46.7300),
(44, 'Shenandoah National Park', 'nature', 'A national park in Virginia encompassing part of the Blue Ridge Mountains.<br><a href=''https://en.wikipedia.org/wiki/Shenandoah_National_Park'' target=''_blank''>Read more</a>', -78.2927, 38.7005),
(45, 'Shoshone Falls', 'nature', 'A waterfall on the Snake River in southern Idaho, sometimes called the "Niagara of the West".<br><a href=''https://en.wikipedia.org/wiki/Shoshone_Falls'' target=''_blank''>Read more</a>', -114.4008, 42.5953),
(46, 'Voyageurs National Park', 'nature', 'A national park in northern Minnesota known for its water-based recreation.<br><a href=''https://en.wikipedia.org/wiki/Voyageurs_National_Park'' target=''_blank''>Read more</a>', -92.8830, 48.5000),
(47, 'White Sands National Park', 'nature', 'A national park in southern New Mexico featuring vast white gypsum sand dunes.<br><a href=''https://en.wikipedia.org/wiki/White_Sands_National_Park'' target=''_blank''>Read more</a>', -106.1717, 32.7797),
(48, 'Zion National Park', 'nature', 'A national park in southwestern Utah known for its steep red cliffs.<br><a href=''https://en.wikipedia.org/wiki/Zion_National_Park'' target=''_blank''>Read more</a>', -113.0000, 37.3000),
(49, 'New York Chinese Scholars Garden', 'nature', 'An authentic classical Chinese garden located in Staten Island, New York.<br><a href=''https://www.atlasobscura.com/places/new-york-chinese-scholars-garden'' target=''_blank''>Read more</a>', -74.1043, 40.6420),
(50, 'The Morgan Library & Museum', 'books', 'A museum and research library in New York City, originally the private library of financier J.P. Morgan.<br><a href=''https://en.wikipedia.org/wiki/Morgan_Library_%26_Museum'' target=''_blank''>Read more</a>', -73.9814, 40.7492),
(51, 'Forest Hills Gardens', 'city', 'A planned community in Queens, New York, known for its Tudor-style architecture.<br><a href=''https://en.wikipedia.org/wiki/Forest_Hills,_Queens'' target=''_blank''>Read more</a>', -73.8450, 40.7150),
(52, 'The Mysterious Bookshop', 'books', 'The oldest mystery fiction specialty store in the world, located in New York City.<br><a href=''https://www.mysteriousbookshop.com/pages/about-us'' target=''_blank''>Read more</a>', -74.0092, 40.7149),
(53, 'Murray''s Cheese', 'food', 'A renowned cheese shop in New York City, offering a wide selection of cheeses and gourmet foods.<br><a href=''https://www.murrayscheese.com/wom/locations'' target=''_blank''>Read more</a>', -74.0031, 40.7316),
(54, 'Green Lakes State Park', 'nature', 'A state park in New York known for its two glacial lakes and old-growth forest.<br><a href=''https://en.wikipedia.org/wiki/Green_Lakes_State_Park'' target=''_blank''>Read more</a>', -75.9730, 43.0490),
(55, 'Chittenango Falls State Park', 'nature', 'A state park in New York featuring a 167-foot waterfall cascading over ancient bedrock.<br><a href=''https://en.wikipedia.org/wiki/Chittenango_Falls_State_Park'' target=''_blank''>Read more</a>', -75.8680, 42.9850),
(56, 'Van Leeuwen Ice Cream', 'food', 'An artisanal ice cream shop in New York City known for its classic and vegan flavors.<br><a href=''https://vanleeuwenicecream.com/'' target=''_blank''>Read more</a>', -73.9857, 40.7229),
(57, 'Dolomites', 'nature', 'A mountain range in northeastern Italy known for its dramatic peaks and scenic beauty.<br><a href=''https://en.wikipedia.org/wiki/Dolomites'' target=''_blank''>Read more</a>', 11.7500, 46.5000),
(58, 'Tromsø', 'city', 'A city in northern Norway known for its Arctic cathedral and viewing of the Northern Lights.<br><a href=''https://en.wikipedia.org/wiki/Troms%C3%B8'' target=''_blank''>Read more</a>', 18.9553, 69.6496),
(59, 'Zermatt', 'city', 'A mountain resort renowned for skiing, climbing, and hiking, located in the Swiss Alps.<br><a href=''https://en.wikipedia.org/wiki/Zermatt'' target=''_blank''>Read more</a>', 7.7486, 46.0207),
(60, 'The Storr', 'nature', 'A rocky hill on the Isle of Skye in Scotland, famous for its distinctive pinnacle known as the Old Man of Storr.<br><a href=''https://en.wikipedia.org/wiki/The_Storr'' target=''_blank''>Read more</a>', -6.1800, 57.5000),
(61, 'Lübbenau', 'city', 'A town in Brandenburg, Germany, known as the gateway to the Spreewald biosphere reserve.<br><a href=''https://en.wikipedia.org/wiki/L%C3%BCbbenau'' target=''_blank''>Read more</a>', 13.9500, 51.8667),
(62, 'Mount Rainier', 'nature', 'A stratovolcano located in Washington State, the highest mountain in the Cascade Range.<br><a href=''https://en.wikipedia.org/wiki/Mount_Rainier'' target=''_blank''>Read more</a>', -121.7600, 46.8523),
(63, 'Mount Rainier National Park', 'nature', 'A national park in Washington State encompassing Mount Rainier and surrounding wilderness.<br><a href=''https://en.wikipedia.org/wiki/Mount_Rainier_National_Park'' target=''_blank''>Read more</a>', -121.7000, 46.8500),
(64, 'Damajagua Waterfalls', 'nature', 'A series of 27 waterfalls located near Puerto Plata in the Dominican Republic, popular for canyoning.<br><a href=''https://www.tripadvisor.com/Attraction_Review-g4971761-d13376318-Reviews-Damajagua_Waterfalls-Imbert_Puerto_Plata_Province_Dominican_Republic.html'' target=''_blank''>Read more</a>', -70.8000, 19.7000),
(65, 'La Rejoya', 'nature', 'A natural area in the Dominican Republic known for its scenic beauty and waterfalls.<br><a href=''https://www.tripadvisor.com/Attraction_Review-g147288-d17436658-Reviews-La_Rejoya-Santo_Domingo_Santo_Domingo_Province_Dominican_Republic.html'' target=''_blank''>Read more</a>', -70.0000, 18.5000),
(66, 'Salto del Gallo', 'nature', 'A waterfall located in the Dominican Republic, known for its picturesque setting.<br><a href=''https://www.tripadvisor.com/Attraction_Review-g147288-d17436658-Reviews-Salto_del_Gallo-Santo_Domingo_Santo_Domingo_Province_Dominican_Republic.html'' target=''_blank''>Read more</a>', -70.0000, 18.5000),
(67, 'Monumento Natural Salto de Socoa', 'nature', 'A natural monument in the Dominican Republic featuring a beautiful waterfall.<br><a href=''https://www.tripadvisor.es/Attraction_Review-g7382843-d7380882-Reviews-Salto_de_Socoa-Monte_Plata_Monte_Plata_Province_Dominican_Republic.html'' target=''_blank''>Read more</a>', -69.8000, 18.8000),
(68, 'Salto Alto', 'nature', 'A waterfall in the Dominican Republic known for its height and surrounding lush vegetation.<br><a href=''https://www.tripadvisor.com/Attraction_Review-g1644879-d14924214-Reviews-Salto_Alto-Bayaguana_Monte_Plata_Province_Dominican_Republic.html'' target=''_blank''>Read more</a>', -70.0000, 18.5000),
(69, 'Salcedo', 'city', 'A city in the Hermanas Mirabal province of the Dominican Republic.<br><a href=''https://en.wikipedia.org/wiki/Salcedo,_Dominican_Republic'' target=''_blank''>Read more</a>', -70.4167, 19.3833),
(70, 'Salto de Elena', 'nature', 'A waterfall located in the Dominican Republic.<br><a href=''https://evendo.com/locations/dominican-republic/cibao-valley/attraction/salto-de-elena'' target=''_blank''>Read more</a>', -70.0000, 19.0000),
(71, 'Cascada de las Golondrinas', 'nature', 'A stunning waterfall near Guabal, Panama.<br><a href=''https://www.journeyera.com/las-golondrinas-waterfall/'' target=''_blank''>Read more</a>', -81.0833, 8.5000),
(72, 'Cascada Las Tainas', 'nature', 'A hidden waterfall near Los Cacaos, Dominican Republic.<br><a href=''https://ericmiller.pro/life/cascada-las-tainas-a-hidden-waterfall-escape-in-the-dominican-republic/'' target=''_blank''>Read more</a>', -70.1833, 18.4667),
(73, 'Salto El Zumbador', 'nature', 'A captivating waterfall located in El Valle, Dominican Republic.<br><a href=''https://evendo.com/locations/dominican-republic/los-haitises/attraction/salto-el-zumbador'' target=''_blank''>Read more</a>', -69.4000, 19.2000),
(74, 'Salto de la Jalda', 'nature', 'The highest waterfall in the Caribbean, located in the Dominican Republic.<br><a href=''https://www.alltrails.com/trail/dominican-republic/el-seybo/saltos-de-la-jalda'' target=''_blank''>Read more</a>', -69.0333, 18.9000),
(75, 'Salto El Berro', 'nature', 'A breathtaking waterfall surrounded by lush landscapes in the Dominican Republic.<br><a href=''https://evendo.com/locations/dominican-republic/central-mountain-range/attraction/salto-el-berro'' target=''_blank''>Read more</a>', -70.5167, 19.0000),
(76, 'Salto Toro Flaco', 'nature', 'A scenic waterfall located in Los Bueyes, Dominican Republic.<br><a href=''https://mindtrip.ai/attraction/los-bueyes-san-jose-de-ocoa/salto-toro-flaco/at-2F02Et2W'' target=''_blank''>Read more</a>', -70.5000, 18.7000),
(77, 'Jima Falls', 'nature', 'A beautiful waterfall in Bonao, Dominican Republic.<br><a href=''https://jackcana.tours/en/secrets/jima-falls/'' target=''_blank''>Read more</a>', -70.4000, 18.9333),
(78, 'Cascada Limón', 'nature', 'A popular waterfall in Samaná, Dominican Republic.<br><a href=''https://www.tripadvisor.com/Attraction_Review-g7142209-d23782900-Reviews-Cascada_Limon-El_Limon_Samana_Province_Dominican_Republic.html'' target=''_blank''>Read more</a>', -69.4500, 19.2000),
(79, 'Aguas Blancas', 'nature', 'A scenic waterfall located in Constanza, Dominican Republic.<br><a href=''https://www.tripadvisor.com/Attraction_Review-g658220-d15209048-Reviews-Salto_Aguas_Blancas_Waterfall-Constanza_La_Vega_Province_Dominican_Republic.html'' target=''_blank''>Read more</a>', -70.7000, 18.9000),
(80, 'Baiguate Waterfall', 'nature', 'A beautiful cascade in Jarabacoa, Dominican Republic.<br><a href=''https://www.tripadvisor.com/Attraction_Review-g675009-d3440196-Reviews-Baiguate_Salto_Waterfall-Jarabacoa_La_Vega_Province_Dominican_Republic.html'' target=''_blank''>Read more</a>', -70.6333, 19.1167),
(81, 'Salto Jimenoa II', 'nature', 'A powerful waterfall in Jarabacoa, Dominican Republic.<br><a href=''https://www.tripadvisor.com/Attraction_Review-g675009-d1190765-Reviews-Salto_de_Jimenoa_Dos-Jarabacoa_La_Vega_Province_Dominican_Republic.html'' target=''_blank''>Read more</a>', -70.6333, 19.1167),
(82, 'Allgäu Alps', 'nature', 'A mountain range in the Northern Limestone Alps, located on the Austria-Germany border.<br><a href=''https://en.wikipedia.org/wiki/Allg%C3%A4u_Alps'' target=''_blank''>Read more</a>', 10.3000, 47.4000),
(83, 'Eibsee', 'nature', 'A lake in Bavaria, Germany, located at the base of the Zugspitze.<br><a href=''https://en.wikipedia.org/wiki/Eibsee'' target=''_blank''>Read more</a>', 10.9667, 47.4667),
(84, 'Zugspitze', 'nature', 'Germany''s highest peak, located in the Bavarian Alps.<br><a href=''https://zugspitze.de/en/Our-mountain-worlds/The-areas/Zugspitze'' target=''_blank''>Read more</a>', 10.9833, 47.4211),
(85, 'Cayo Arena', 'nature', 'A small island off the coast of Puerto Plata, Dominican Republic.<br><a href=''https://www.tripadvisor.com/Attraction_Review-g1605231-d7896395-Reviews-Cayo_Arena-Monte_Cristi_Monte_Cristi_Province_Dominican_Republic.html'' target=''_blank''>Read more</a>', -71.7333, 19.8833),
(86, 'Faroe Islands', 'nature', 'An archipelago between the Norwegian Sea and the North Atlantic.<br><a href=''https://en.wikipedia.org/wiki/Faroe_Islands'' target=''_blank''>Read more</a>', -6.9118, 62.0000),
(87, 'Hay-on-Wye', 'city', 'A small market town in Wales, known for its many bookshops.<br><a href=''https://en.wikipedia.org/wiki/Hay-on-Wye'' target=''_blank''>Read more</a>', -3.1250, 52.0750),
(88, 'Daunt Books Marylebone', 'books', 'A historic bookshop in London, UK.<br><a href=''https://www.dauntbooks.co.uk/'' target=''_blank''>Read more</a>', -0.1528, 51.5211),
(89, 'El Ateneo Grand Splendid', 'books', 'A famous bookstore located in a converted theatre in Buenos Aires, Argentina.<br><a href=''https://en.wikipedia.org/wiki/El_Ateneo_Grand_Splendid'' target=''_blank''>Read more</a>', -58.3933, -34.5961),
(90, 'Bookstore Dominicanen', 'books', 'A bookstore located in a former Dominican church in Maastricht, Netherlands.<br><a href=''https://www.boekhandeldominicanen.nl/'' target=''_blank''>Read more</a>', 5.6889, 50.8497),
(91, 'Cafebrería El Péndulo Condesa', 'books', 'A bookstore and café located in Mexico City, Mexico.<br><a href=''https://pendulo.com/index.php'' target=''_blank''>Read more</a>', -99.1740, 19.4136),
(92, 'Zhongshu Bookstore', 'books', 'A modern bookstore chain in China, known for its unique architecture.<br><a href=''https://www.stirworld.com/see-features-dujiangyan-zhongshuge-bookstore-by-x-living-is-a-surreal-city-of-illusions'' target=''_blank''>Read more</a>', 121.4737, 31.2304),
(93, 'The Last Bookstore', 'books', 'A large independent bookstore in Los Angeles, USA.<br><a href=''https://en.wikipedia.org/wiki/The_Last_Bookstore'' target=''_blank''>Read more</a>', -118.2498, 34.0470),
(94, 'Shakespeare and Company', 'books', 'An iconic English-language bookstore in Paris, France.<br><a href=''https://en.wikipedia.org/wiki/Shakespeare_and_Company_(bookstore)'' target=''_blank''>Read more</a>', 2.3470, 48.8527),
(95, 'Old Florida Book Shop', 'books', 'A rare and used bookstore located in Fort Lauderdale, Florida, USA.<br><a href=''https://www.oldfloridabookshop.com/'' target=''_blank''>Read more</a>', -80.1467, 26.1375),
(96, 'Gold Creek Pond', 'nature', 'A scenic pond located in the Mount Baker-Snoqualmie National Forest, Washington, USA.<br><a href=''https://www.wta.org/go-hiking/hikes/gold-creek-pond'' target=''_blank''>Read more</a>', -121.4233, 47.3917),
(97, 'Naches Peak Loop Trailhead', 'nature', 'A popular hiking trail in Mount Rainier National Park, Washington, USA.<br><a href=''https://www.tripadvisor.com/Attraction_Review-g58671-d23604498-Reviews-Naches_Peak_Loop_Trail-Paradise_Mount_Rainier_National_Park_Washington.html'' target=''_blank''>Read more</a>', -121.5172, 46.8700),
(98, 'Isabel de Torres', 'nature', 'National park located in Puerto Plata, Dominican Republic.<br><a href=''https://jackcana.tours/en/secrets/isabel-de-torres-national-park/'' target=''_blank''>Read more</a>', -70.7075, 19.7547),
(99, 'Deadwood', 'city', 'A historic city in South Dakota, USA, known for its gold rush history.<br><a href=''https://en.wikipedia.org/wiki/Deadwood,_South_Dakota'' target=''_blank''>Read more</a>', -103.7296, 44.3764),
(100, 'Half Moon Bay', 'nature', 'A scenic coastal town in California known for beaches and cliffs.<br><a href=''https://en.wikipedia.org/wiki/Half_Moon_Bay,_California'' target=''_blank''>Read more</a>', -122.4337, 37.4636),
(101, 'Estes Park', 'city', 'A town in Colorado known as the gateway to Rocky Mountain National Park.<br><a href=''https://en.wikipedia.org/wiki/Estes_Park,_Colorado'' target=''_blank''>Read more</a>', -105.5217, 40.3772),
(102, 'St. Augustine', 'city', 'The oldest city in the U.S., located in Florida and known for its Spanish colonial architecture.<br><a href=''https://en.wikipedia.org/wiki/St._Augustine,_Florida'' target=''_blank''>Read more</a>', -81.3110, 29.9012),
(103, 'Grand Teton National Park', 'nature', 'A U.S. national park in northwestern Wyoming featuring the Teton mountain range.<br><a href=''https://en.wikipedia.org/wiki/Grand_Teton_National_Park'' target=''_blank''>Read more</a>', -110.6818, 43.7904),
(104, 'Valley of Fire', 'nature', 'Nevada''s oldest and largest state park, known for red sandstone formations.<br><a href=''https://en.wikipedia.org/wiki/Valley_of_Fire_State_Park'' target=''_blank''>Read more</a>', -114.5144, 36.4852),
(105, 'Maroon Bells-Snowmass Wilderness', 'nature', 'A wilderness area in Colorado featuring the iconic Maroon Bells peaks.<br><a href=''https://en.wikipedia.org/wiki/Maroon_Bells'' target=''_blank''>Read more</a>', -106.9500, 39.0700),
(106, 'Glacier National Park', 'nature', 'A national park in Montana known for its glaciers, peaks, and lakes.<br><a href=''https://en.wikipedia.org/wiki/Glacier_National_Park_(U.S.)'' target=''_blank''>Read more</a>', -113.7870, 48.7596),
(107, 'Palouse Falls', 'nature', 'A dramatic waterfall in southeastern Washington state.<br><a href=''https://en.wikipedia.org/wiki/Palouse_Falls'' target=''_blank''>Read more</a>', -118.2406, 46.6633),
(108, 'Þakgil, Iceland', 'nature', 'A remote canyon and campsite surrounded by dramatic cliffs and mossy landscapes in southern Iceland.<br><a href=''https://guidetoiceland.is/connect-with-locals/aldasigmunds/akgil-a-beautiful-hidden-gem-in-south-iceland'' target=''_blank''>Read more</a>', -18.8525, 63.5230),
(109, 'Skógafoss', 'nature', 'A stunning 60-meter waterfall on the Skógá River in southern Iceland.<br><a href=''https://en.wikipedia.org/wiki/Sk%C3%B3gafoss'' target=''_blank''>Read more</a>', -19.5110, 63.5321),
(110, 'Cuilcagh Boardwalk Trail', 'nature', 'Also known as the Stairway to Heaven, a popular wooden boardwalk trail in Northern Ireland.<br><a href=''https://en.wikipedia.org/wiki/Cuilcagh'' target=''_blank''>Read more</a>', -7.8091, 54.2276),
(111, 'U.S. Naval Radio Station Haiku', 'nature', 'Also known as the Haiku Stairs or Stairway to Heaven, a steep hiking trail on O''ahu, Hawaii.<br><a href=''https://en.wikipedia.org/wiki/Haiku_Stairs'' target=''_blank''>Read more</a>', -157.9194, 21.3965);
--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: map_user
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: geocode_settings; Type: TABLE DATA; Schema: tiger; Owner: map_user
--

COPY tiger.geocode_settings (name, setting, unit, category, short_desc) FROM stdin;
\.


--
-- Data for Name: pagc_gaz; Type: TABLE DATA; Schema: tiger; Owner: map_user
--

COPY tiger.pagc_gaz (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- Data for Name: pagc_lex; Type: TABLE DATA; Schema: tiger; Owner: map_user
--

COPY tiger.pagc_lex (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- Data for Name: pagc_rules; Type: TABLE DATA; Schema: tiger; Owner: map_user
--

COPY tiger.pagc_rules (id, rule, is_custom) FROM stdin;
\.


--
-- Data for Name: topology; Type: TABLE DATA; Schema: topology; Owner: map_user
--

COPY topology.topology (id, name, srid, "precision", hasz) FROM stdin;
\.


--
-- Data for Name: layer; Type: TABLE DATA; Schema: topology; Owner: map_user
--

COPY topology.layer (topology_id, layer_id, schema_name, table_name, feature_column, feature_type, level, child_id) FROM stdin;
\.


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: map_user
--

SELECT pg_catalog.setval('public.locations_id_seq', 5, true);


--
-- Name: topology_id_seq; Type: SEQUENCE SET; Schema: topology; Owner: map_user
--

SELECT pg_catalog.setval('topology.topology_id_seq', 1, false);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: map_user
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

