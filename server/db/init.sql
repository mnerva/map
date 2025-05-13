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
(3, 'Zurich', 'city', NULL, 8.5417, 47.3769),
(4, 'Bergen', 'city', NULL, 5.3167, 60.4),
(5, 'Scarfes bar', 'food', NULL, -0.1206, 51.5201),
(6, 'Ler Devagar', 'books', NULL, -9.1786, 38.7035),
(7, 'Livraria Lello', 'books', NULL, -8.6149, 41.1466),
(8, 'Madeira', 'city', NULL, -16.9595, 32.7607),
(9, 'Pico Ruivo', 'nature', NULL, -16.9330, 32.7552),
(10, 'Pico do Arieiro', 'nature', NULL, -16.9280, 32.7355),
(11, 'Positano', 'city', NULL, 14.4842, 40.6281),
(12, 'Cărturești Carusel', 'books', NULL, 26.1030, 44.4310);


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

