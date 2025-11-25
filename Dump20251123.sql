-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: mision_emprende
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext,
  `order_number` int NOT NULL,
  `timer_duration` int DEFAULT NULL,
  `config_data` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `activity_type_id` bigint NOT NULL,
  `stage_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `activities_stage_id_order_number_55d59c0c_uniq` (`stage_id`,`order_number`),
  KEY `activities_stage_i_7425c6_idx` (`stage_id`),
  KEY `activities_activit_a33aa7_idx` (`activity_type_id`),
  KEY `activities_stage_i_f1817d_idx` (`stage_id`,`order_number`),
  CONSTRAINT `activities_activity_type_id_4b2a4435_fk_activity_types_id` FOREIGN KEY (`activity_type_id`) REFERENCES `activity_types` (`id`),
  CONSTRAINT `activities_stage_id_0c437802_fk_stages_id` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,'Personalización','Los equipos personalizan su nombre e indican si se conocen',1,120,NULL,1,'2025-11-04 03:58:18.797000','2025-11-04 22:36:07.412000',1,1),(2,'Presentación','Minijuego de anagramas: adivina las palabras desordenadas (3 palabras, 5 tokens cada una = 15 tokens total)',2,480,'{\"type\": \"anagram\", \"words\": [{\"word\": \"emprender\", \"anagram\": \"eprdenemr\"}, {\"word\": \"innovacion\", \"anagram\": \"ooivanicnn\"}, {\"word\": \"creatividad\", \"anagram\": \"edavitiacrd\"}], \"total_tokens\": 15, \"words_per_game\": 3, \"tokens_per_word\": 5}',1,'2025-11-04 16:03:58.105000','2025-11-04 22:13:01.048000',2,1),(3,'Seleccionar Tema','Elige un tema de interÃ©s relacionado con tu facultad',1,160,NULL,1,'2025-11-04 23:19:09.746000','2025-11-07 14:28:30.822001',3,2),(4,'Ver el DesafÃ­o','Lee y analiza el desafÃ­o asociado a tu tema',2,160,NULL,1,'2025-11-04 23:19:09.755000','2025-11-07 14:28:43.478728',3,2),(5,'Bubble Map','Crea un mapa mental con ideas y conceptos relacionados al desafÃ­o',3,480,NULL,1,'2025-11-04 23:19:09.756000','2025-11-07 14:28:58.964030',3,2),(6,'Subida de Prototipo Lego','Los equipos construyen físicamente un prototipo con legos y suben una foto del resultado',1,600,NULL,1,'2025-11-05 02:28:51.637000','2025-11-07 14:29:11.498568',4,3),(7,'Formulario de Pitch','Los equipos completan un formulario estructurado para crear el pitch: intro-problema (etapa 2), solución (etapa 3) y cierre',1,360,NULL,1,'2025-11-05 05:28:59.108000','2025-11-07 14:29:29.883250',5,4),(8,'Presentación del Pitch','Los equipos presentan su pitch siguiendo un orden de presentación. Después de cada presentación, los otros equipos pueden evaluar.',2,800,NULL,1,'2025-11-05 05:28:59.120000','2025-11-07 14:29:46.273248',6,4);
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_types`
--

DROP TABLE IF EXISTS `activity_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` longtext,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `activity_ty_code_0cb432_idx` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_types`
--

LOCK TABLES `activity_types` WRITE;
/*!40000 ALTER TABLE `activity_types` DISABLE KEYS */;
INSERT INTO `activity_types` VALUES (1,'personalizacion','Personalización','Actividad de personalización de equipos',1,'2025-11-04 03:58:18.177000','2025-11-04 16:03:58.072000'),(2,'minijuego','Minijuego','Actividades de minijuegos y presentación',1,'2025-11-04 16:03:58.097000','2025-11-04 16:03:58.097000'),(3,'','Interactiva','Actividad interactiva',1,'2025-11-04 23:19:09.732000','2025-11-04 23:19:09.732000'),(4,'prototipo','Subida de Prototipo','Actividad para subir imagen del prototipo físico construido',1,'2025-11-05 02:28:51.612000','2025-11-05 02:28:51.612000'),(5,'formulario_pitch','Formulario de Pitch','Actividad para completar el formulario del pitch con intro-problema, solución y cierre',1,'2025-11-05 05:28:59.078000','2025-11-05 05:28:59.078000'),(6,'presentacion_pitch','Presentación del Pitch','Actividad para presentar el pitch y evaluar a otros equipos',1,'2025-11-05 05:28:59.089000','2025-11-05 05:28:59.089000');
/*!40000 ALTER TABLE `activity_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `administrators`
--

DROP TABLE IF EXISTS `administrators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrators` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_super_admin` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `administrat_user_id_20df6f_idx` (`user_id`),
  CONSTRAINT `administrators_user_id_5ff75f06_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrators`
--

LOCK TABLES `administrators` WRITE;
/*!40000 ALTER TABLE `administrators` DISABLE KEYS */;
/*!40000 ALTER TABLE `administrators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add access failure',7,'add_accessfailurelog'),(26,'Can change access failure',7,'change_accessfailurelog'),(27,'Can delete access failure',7,'delete_accessfailurelog'),(28,'Can view access failure',7,'view_accessfailurelog'),(29,'Can add access attempt',8,'add_accessattempt'),(30,'Can change access attempt',8,'change_accessattempt'),(31,'Can delete access attempt',8,'delete_accessattempt'),(32,'Can view access attempt',8,'view_accessattempt'),(33,'Can add access log',9,'add_accesslog'),(34,'Can change access log',9,'change_accesslog'),(35,'Can delete access log',9,'delete_accesslog'),(36,'Can view access log',9,'view_accesslog'),(37,'Can add Administrador',10,'add_administrator'),(38,'Can change Administrador',10,'change_administrator'),(39,'Can delete Administrador',10,'delete_administrator'),(40,'Can view Administrador',10,'view_administrator'),(41,'Can add Profesor',11,'add_professor'),(42,'Can change Profesor',11,'change_professor'),(43,'Can delete Profesor',11,'delete_professor'),(44,'Can view Profesor',11,'view_professor'),(45,'Can add Estudiante',12,'add_student'),(46,'Can change Estudiante',12,'change_student'),(47,'Can delete Estudiante',12,'delete_student'),(48,'Can view Estudiante',12,'view_student'),(49,'Can add Facultad',13,'add_faculty'),(50,'Can change Facultad',13,'change_faculty'),(51,'Can delete Facultad',13,'delete_faculty'),(52,'Can view Facultad',13,'view_faculty'),(53,'Can add Carrera',14,'add_career'),(54,'Can change Carrera',14,'change_career'),(55,'Can delete Carrera',14,'delete_career'),(56,'Can view Carrera',14,'view_career'),(57,'Can add Curso',15,'add_course'),(58,'Can change Curso',15,'change_course'),(59,'Can delete Curso',15,'delete_course'),(60,'Can view Curso',15,'view_course'),(61,'Can add Sesión de Juego',16,'add_gamesession'),(62,'Can change Sesión de Juego',16,'change_gamesession'),(63,'Can delete Sesión de Juego',16,'delete_gamesession'),(64,'Can view Sesión de Juego',16,'view_gamesession'),(65,'Can add Equipo',17,'add_team'),(66,'Can change Equipo',17,'change_team'),(67,'Can delete Equipo',17,'delete_team'),(68,'Can view Equipo',17,'view_team'),(69,'Can add team student',18,'add_teamstudent'),(70,'Can change team student',18,'change_teamstudent'),(71,'Can delete team student',18,'delete_teamstudent'),(72,'Can view team student',18,'view_teamstudent'),(73,'Can add Personalización del Equipo',19,'add_teampersonalization'),(74,'Can change Personalización del Equipo',19,'change_teampersonalization'),(75,'Can delete Personalización del Equipo',19,'delete_teampersonalization'),(76,'Can view Personalización del Equipo',19,'view_teampersonalization'),(77,'Can add Etapa de Sesión',20,'add_sessionstage'),(78,'Can change Etapa de Sesión',20,'change_sessionstage'),(79,'Can delete Etapa de Sesión',20,'delete_sessionstage'),(80,'Can view Etapa de Sesión',20,'view_sessionstage'),(81,'Can add Progreso de Actividad del Equipo',21,'add_teamactivityprogress'),(82,'Can change Progreso de Actividad del Equipo',21,'change_teamactivityprogress'),(83,'Can delete Progreso de Actividad del Equipo',21,'delete_teamactivityprogress'),(84,'Can view Progreso de Actividad del Equipo',21,'view_teamactivityprogress'),(85,'Can add Bubble Map del Equipo',22,'add_teambubblemap'),(86,'Can change Bubble Map del Equipo',22,'change_teambubblemap'),(87,'Can delete Bubble Map del Equipo',22,'delete_teambubblemap'),(88,'Can view Bubble Map del Equipo',22,'view_teambubblemap'),(89,'Can add Tablet',23,'add_tablet'),(90,'Can change Tablet',23,'change_tablet'),(91,'Can delete Tablet',23,'delete_tablet'),(92,'Can view Tablet',23,'view_tablet'),(93,'Can add Conexión de Tablet',24,'add_tabletconnection'),(94,'Can change Conexión de Tablet',24,'change_tabletconnection'),(95,'Can delete Conexión de Tablet',24,'delete_tabletconnection'),(96,'Can view Conexión de Tablet',24,'view_tabletconnection'),(97,'Can add Asignación de Reto de Ruleta',25,'add_teamrouletteassignment'),(98,'Can change Asignación de Reto de Ruleta',25,'change_teamrouletteassignment'),(99,'Can delete Asignación de Reto de Ruleta',25,'delete_teamrouletteassignment'),(100,'Can view Asignación de Reto de Ruleta',25,'view_teamrouletteassignment'),(101,'Can add Transacción de Tokens',26,'add_tokentransaction'),(102,'Can change Transacción de Tokens',26,'change_tokentransaction'),(103,'Can delete Transacción de Tokens',26,'delete_tokentransaction'),(104,'Can view Transacción de Tokens',26,'view_tokentransaction'),(105,'Can add Evaluación Peer',27,'add_peerevaluation'),(106,'Can change Evaluación Peer',27,'change_peerevaluation'),(107,'Can delete Evaluación Peer',27,'delete_peerevaluation'),(108,'Can view Evaluación Peer',27,'view_peerevaluation'),(109,'Can add Etapa',28,'add_stage'),(110,'Can change Etapa',28,'change_stage'),(111,'Can delete Etapa',28,'delete_stage'),(112,'Can view Etapa',28,'view_stage'),(113,'Can add Tipo de Actividad',29,'add_activitytype'),(114,'Can change Tipo de Actividad',29,'change_activitytype'),(115,'Can delete Tipo de Actividad',29,'delete_activitytype'),(116,'Can view Tipo de Actividad',29,'view_activitytype'),(117,'Can add Actividad',30,'add_activity'),(118,'Can change Actividad',30,'change_activity'),(119,'Can delete Actividad',30,'delete_activity'),(120,'Can view Actividad',30,'view_activity'),(121,'Can add Tema',31,'add_topic'),(122,'Can change Tema',31,'change_topic'),(123,'Can delete Tema',31,'delete_topic'),(124,'Can view Tema',31,'view_topic'),(125,'Can add Desafío',32,'add_challenge'),(126,'Can change Desafío',32,'change_challenge'),(127,'Can delete Desafío',32,'delete_challenge'),(128,'Can view Desafío',32,'view_challenge'),(129,'Can add Reto de Ruleta',33,'add_roulettechallenge'),(130,'Can change Reto de Ruleta',33,'change_roulettechallenge'),(131,'Can delete Reto de Ruleta',33,'delete_roulettechallenge'),(132,'Can view Reto de Ruleta',33,'view_roulettechallenge'),(133,'Can add Minijuego',34,'add_minigame'),(134,'Can change Minijuego',34,'change_minigame'),(135,'Can delete Minijuego',34,'delete_minigame'),(136,'Can view Minijuego',34,'view_minigame'),(137,'Can add Objetivo de Aprendizaje',35,'add_learningobjective'),(138,'Can change Objetivo de Aprendizaje',35,'change_learningobjective'),(139,'Can delete Objetivo de Aprendizaje',35,'delete_learningobjective'),(140,'Can view Objetivo de Aprendizaje',35,'view_learningobjective'),(141,'Can add Evaluación de Reflexión',36,'add_reflectionevaluation'),(142,'Can change Evaluación de Reflexión',36,'change_reflectionevaluation'),(143,'Can delete Evaluación de Reflexión',36,'delete_reflectionevaluation'),(144,'Can view Evaluación de Reflexión',36,'view_reflectionevaluation'),(145,'Can add Grupo de Sesiones',37,'add_sessiongroup'),(146,'Can change Grupo de Sesiones',37,'change_sessiongroup'),(147,'Can delete Grupo de Sesiones',37,'delete_sessiongroup'),(148,'Can view Grupo de Sesiones',37,'view_sessiongroup'),(149,'Can add Opción de Sopa de Letras',38,'add_wordsearchoption'),(150,'Can change Opción de Sopa de Letras',38,'change_wordsearchoption'),(151,'Can delete Opción de Sopa de Letras',38,'delete_wordsearchoption'),(152,'Can view Opción de Sopa de Letras',38,'view_wordsearchoption');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'!XFDOlErlTSFKCR5nhItdUKVW6FG9VQMvHK8mTiPE',NULL,1,'admin','','','admin@test.com',1,1,'2025-11-04 00:24:42.052000'),(2,'pbkdf2_sha256$720000$nCqDVQGmEzMvqEbz1AomFy$rZ3wm/LZZGdUrE02G0KFPT9fhSeul6Lr2DB2Clt8yFc=','2025-11-04 00:32:06.388000',0,'p','profesor','perez','p@udd.cl',0,1,'2025-11-04 00:32:02.390000'),(3,'pbkdf2_sha256$720000$C9o0Nnwft9nDjC9Q7BirRs$iViHqQ6JhtGsKrmVS5VMtTWHNQu7YfgAkIwEWSaR5Zc=','2025-11-17 07:34:05.369186',1,'mati','','','',1,1,'2025-11-04 00:38:53.463000'),(4,'pbkdf2_sha256$720000$kheMrs2Dqi6o20IARls6fV$8aMTMgAuEZU7Fg4ESILWR6sPjK3kfndcFzZaqSxdXEQ=',NULL,0,'elprofe','elprofe','elprofe','elprofe@udd.cl',0,1,'2025-11-04 18:10:48.000000'),(5,'pbkdf2_sha256$720000$03jjkKTq1jTsWVesq9Wfav$pA56eflGHSQOPVlyOoMlJLCfsJfk+IVyB+GC0TjNzPk=','2025-11-04 18:40:35.599000',0,'pr','marlon','123451','pr@udd.cl',0,1,'2025-11-04 18:40:33.068000'),(6,'pbkdf2_sha256$720000$xsaC8YnuHMxAvn7p3GFIPX$MLu20zt/5yF/X8j+qPYUdMS/uNbL7j7jUhwFem6TBZg=','2025-11-07 15:36:41.837569',0,'juan','juan','perez','juan@udd.cl',0,1,'2025-11-05 17:06:47.184000'),(7,'pbkdf2_sha256$720000$k08IiiaH1HmZRoNKmWkNCN$J7BfYW5eZayLybuGzEEkoQ2n11DiaDs/Lzq4KWNjZ2c=','2025-11-07 18:12:50.589565',0,'YGUYB','YGIHB','GIYG','YGUYB@udd.cl',0,1,'2025-11-07 18:12:47.437508'),(8,'pbkdf2_sha256$720000$TSPMecldq77w9LjZXB5ulP$t6/Fb9CyNezraAZiOnG/YGPH3pxqzYgp+b595w058Pk=','2025-11-23 14:36:42.346691',0,'juan2','juan','perez','juan2@udd.cl',0,1,'2025-11-07 18:18:31.020824'),(9,'pbkdf2_sha256$720000$Dlw6PlGzsuwIk0RxuyExl0$vC1+Ru73B2kOvu5gGUCNfisNIx7YdC5r0bIrwnS4I2E=','2025-11-19 14:29:29.647111',0,'jorge','Jorge','Pérez','jorge@udd.cl',0,1,'2025-11-19 12:12:59.889285'),(10,'pbkdf2_sha256$720000$YyL5uIT5Frc7GqaSAp2qYy$z7vBT6QnyR2jRYbW/YW/+2DNpCxHH5f1R75FHPTKG1U=','2025-11-20 19:06:07.705007',0,'marcelo','Marcelo','Allende','marcelo@udd.cl',0,1,'2025-11-20 01:41:01.811852'),(11,'pbkdf2_sha256$720000$cb8S76dE8UIoN7untqo6ST$nQV9t4LvFZpBDLG3npbYSmY25j/8srYLuCk4jnd8uzs=','2025-11-23 18:18:00.469058',0,'juean','juan','perz','juean@jndee.cl',0,1,'2025-11-23 17:02:42.654915'),(12,'pbkdf2_sha256$720000$LFnSXbkzxZs0DuyZ0BOZF4$rdz1/FBecdUwBzxi0BrMxCUsNeOIwqWzv0b7lXaJ600=','2025-11-23 17:22:39.847437',0,'juansh','juan','perez','juansh@udd.cl',0,1,'2025-11-23 17:22:37.161174');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `axes_accessattempt`
--

DROP TABLE IF EXISTS `axes_accessattempt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `axes_accessattempt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_agent` varchar(255) NOT NULL,
  `ip_address` char(39) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `http_accept` varchar(1025) NOT NULL,
  `path_info` varchar(255) NOT NULL,
  `attempt_time` datetime(6) NOT NULL,
  `get_data` longtext NOT NULL,
  `post_data` longtext NOT NULL,
  `failures_since_start` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `axes_accessattempt_username_ip_address_user_agent_8ea22282_uniq` (`username`,`ip_address`,`user_agent`),
  KEY `axes_accessattempt_ip_address_10922d9c` (`ip_address`),
  KEY `axes_accessattempt_user_agent_ad89678b` (`user_agent`),
  KEY `axes_accessattempt_username_3f2d4ca0` (`username`),
  CONSTRAINT `axes_accessattempt_chk_1` CHECK ((`failures_since_start` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `axes_accessattempt`
--

LOCK TABLES `axes_accessattempt` WRITE;
/*!40000 ALTER TABLE `axes_accessattempt` DISABLE KEYS */;
INSERT INTO `axes_accessattempt` VALUES (1,'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','127.0.0.1','juean','application/json, text/plain, */*','/api/auth/token/','2025-11-23 17:26:07.871530','','',1),(2,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0','127.0.0.1','juean','application/json, text/plain, */*','/api/auth/token/','2025-11-23 18:17:54.332172','','',1);
/*!40000 ALTER TABLE `axes_accessattempt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `axes_accessfailurelog`
--

DROP TABLE IF EXISTS `axes_accessfailurelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `axes_accessfailurelog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_agent` varchar(255) NOT NULL,
  `ip_address` char(39) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `http_accept` varchar(1025) NOT NULL,
  `path_info` varchar(255) NOT NULL,
  `attempt_time` datetime(6) NOT NULL,
  `locked_out` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `axes_accessfailurelog_user_agent_ea145dda` (`user_agent`),
  KEY `axes_accessfailurelog_ip_address_2e9f5a7f` (`ip_address`),
  KEY `axes_accessfailurelog_username_a8b7e8a4` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `axes_accessfailurelog`
--

LOCK TABLES `axes_accessfailurelog` WRITE;
/*!40000 ALTER TABLE `axes_accessfailurelog` DISABLE KEYS */;
/*!40000 ALTER TABLE `axes_accessfailurelog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `axes_accesslog`
--

DROP TABLE IF EXISTS `axes_accesslog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `axes_accesslog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_agent` varchar(255) NOT NULL,
  `ip_address` char(39) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `http_accept` varchar(1025) NOT NULL,
  `path_info` varchar(255) NOT NULL,
  `attempt_time` datetime(6) NOT NULL,
  `logout_time` datetime(6) DEFAULT NULL,
  `session_hash` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `axes_accesslog_ip_address_86b417e5` (`ip_address`),
  KEY `axes_accesslog_user_agent_0e659004` (`user_agent`),
  KEY `axes_accesslog_username_df93064b` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `axes_accesslog`
--

LOCK TABLES `axes_accesslog` WRITE;
/*!40000 ALTER TABLE `axes_accesslog` DISABLE KEYS */;
INSERT INTO `axes_accesslog` VALUES (1,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 OPR/123.0.0.0','127.0.0.1','mati','text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7','/admin/login/','2025-11-07 14:26:19.694722',NULL,'63ce48493c2bb19e3bf201f01120fa0bd9f932a0c22cdd4b2b50219801eae68a'),(2,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 OPR/123.0.0.0','127.0.0.1','mati','text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7','/admin/login/','2025-11-17 07:34:05.415189',NULL,'549a0cc7ef5af54718bfd16b957abc379abadfd9002a1dec358140c3ce3f1435');
/*!40000 ALTER TABLE `axes_accesslog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `careers`
--

DROP TABLE IF EXISTS `careers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `careers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `faculty_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `careers_faculty_id_name_c4366f21_uniq` (`faculty_id`,`name`),
  UNIQUE KEY `code` (`code`),
  KEY `careers_faculty_58893f_idx` (`faculty_id`),
  KEY `careers_is_acti_c4cbef_idx` (`is_active`),
  CONSTRAINT `careers_faculty_id_ae4a8821_fk_faculties_id` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `careers`
--

LOCK TABLES `careers` WRITE;
/*!40000 ALTER TABLE `careers` DISABLE KEYS */;
INSERT INTO `careers` VALUES (1,'Ingeniería civil informática e innovación tecnológica',NULL,1,'2025-11-04 00:41:26.488000','2025-11-04 00:41:26.488000',1);
/*!40000 ALTER TABLE `careers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `challenges`
--

DROP TABLE IF EXISTS `challenges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `challenges` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `difficulty_level` varchar(20) NOT NULL,
  `learning_objectives` longtext,
  `additional_resources` longtext,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `topic_id` bigint NOT NULL,
  `icon` varchar(10) DEFAULT NULL,
  `persona_age` int DEFAULT NULL,
  `persona_name` varchar(100) DEFAULT NULL,
  `persona_story` longtext,
  `description` longtext,
  `persona_image` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `challenges_topic_i_f14e19_idx` (`topic_id`),
  KEY `challenges_difficu_238107_idx` (`difficulty_level`),
  KEY `challenges_is_acti_5318b2_idx` (`is_active`),
  CONSTRAINT `challenges_topic_id_f5b3d705_fk_topics_id` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `challenges`
--

LOCK TABLES `challenges` WRITE;
/*!40000 ALTER TABLE `challenges` DISABLE KEYS */;
INSERT INTO `challenges` VALUES (1,'Autogestión de tratamientos','medium','','',1,'2025-11-04 23:30:45.718000','2025-11-17 08:07:58.153589',1,'?',50,'Humberto','Fue dado de alta con indicaciones médicas complejas, pero no entendió qué debía seguir tomando ni a quién acudir si se sentía mal.','Muchos errores médicos y complicaciones surgen al cambiar de un centro de salud a otro, por falta de continuidad y seguimiento personalizado.','personas/perfil-ia-1763366872037.png'),(2,'Obesidad','medium','','',1,'2025-11-04 23:30:45.727000','2025-11-17 08:03:35.132286',1,'⚖️',27,'Simona','Tiene una hija pequeña y trabaja tiempo completo. Sabe que la alimentación es clave, pero no ha podido organizar ni aprender a darle una nutrición buena a su hija.','Más de un 70% de la población en Chile presenta sobrepeso u obesidad (MINSAL). Esta situación se debe múltiples factores, entre ellos la falta de ejercicio y educación nutricional, disponibilidad de productos ultraprocesados y la desinformación.','personas/perfil-ia-1763366608710.png'),(3,'Envejecimiento activo','medium','','',1,'2025-11-04 23:30:45.734000','2025-11-17 07:55:32.568298',1,'?',72,'Juana','Vive sola desde que sus hijos se independizaron. Le gustaría mantenerse activa, pero no conoce programas accesibles que la motiven a hacer ejercicio, socializar y prevenir enfermedades.','La población chilena está envejeciendo rápidamente y muchos adultos mayores enfrentan soledad, pérdida de movilidad y falta de programas de prevención.','personas/persona-profile_6.jpg'),(4,'Educación financiera accesible','medium','','',1,'2025-11-04 23:30:45.753000','2025-11-17 07:53:31.801716',2,'?',22,'Martina','Joven emprendedora de 22 años, vende productos por redes sociales. Aunque gana dinero, no sabe cómo organizarlo ni cuánto debe ahorrar o invertir, lo que lo mantiene en constante inestabilidad.','La ausencia de educación financiera en realidades económicas inestables dificulta la planificación y el uso responsable del dinero.','personas/persona-profile_5.jpg'),(5,'Inicio de vida laboral','medium','','',1,'2025-11-04 23:30:45.760000','2025-11-17 07:51:08.129717',2,'?',23,'Andrés','Acaba de egresar de odontología. Le preocupa no poder trabajar pronto, pero ninguna clínica lo ha llamado porque no tiene experiencia previa.','Muchos estudiantes recién titulados enfrentan barreras para conseguir su primer empleo, ya que se les exige experiencia previa que aún no han podido adquirir.','personas/persona-profile_4.jpg'),(6,'Tecnología adultos mayores','medium','','',1,'2025-11-04 23:30:45.766000','2025-11-17 07:47:53.283466',2,'?',70,'Osvaldo','Es un adulto mayor de 70 años y debe pedir ayuda a sus hijos o nietos cada vez que debe hacer tramites.','El avance tecnológico en los últimos años ha sido incremental. Esto ha beneficiado a múltiples sectores, sin embargo el conocimiento y adaptación para los adultos mayores ha sido una gran dificultad.','personas/persona-profile_3.jpg'),(7,'Contaminación por fast fashion','medium','','',1,'2025-11-04 23:30:45.791000','2025-11-17 07:46:31.242909',3,'?',18,'Gabriela','Estudiante de 18 años que vive cerca de esta zona y debe pasar a diario por lugares con desagradables olores.','La moda rápida ha traído graves consecuencias al medio ambiente. Especialmente en sectores del norte de Chile en donde los vertederos y basurales están afectando el diario vivir de las personas.','personas/persona-profile_2.jpg'),(8,'Acceso al agua en la agricultura','medium','','',1,'2025-11-04 23:30:45.798000','2025-11-17 07:44:09.892309',3,'?',50,'Camila','Agricultora de 50 años que cultiva paltas de exportación, ella está complicada de perder su negocio por la cantidad de agua que debe utilizar.','El agua dulce es un recurso natural fundamental para la vida. Hay zonas rurales en que el agua se ha hecho escasa.','personas/persona-profile_1.jpg'),(9,'Gestión de residuos electrónicos','medium','','',1,'2025-11-04 23:30:45.804000','2025-11-17 07:41:19.185456',3,'♻️',29,'Francisco','Cambió su celular y computador el año pasado, pero no sabe dónde llevar los antiguos dispositivos. Terminó guardándolos en un cajón, como millones de personas que desconocen alternativas de reciclaje.','El aumento del consumo tecnológico ha generado toneladas de desechos electrónicos difíciles de reciclar.','personas/persona-profile.jpg');
/*!40000 ALTER TABLE `challenges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `career_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `courses_career__131c4c_idx` (`career_id`),
  KEY `courses_is_acti_25e634_idx` (`is_active`),
  CONSTRAINT `courses_career_id_9d0a8719_fk_careers_id` FOREIGN KEY (`career_id`) REFERENCES `careers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'Ingeniería de software',NULL,1,'2025-11-04 00:47:23.162000','2025-11-04 00:47:23.162000',1);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-11-07 14:28:30.831399','3','EmpatÃ­a - Seleccionar Tema',2,'[{\"changed\": {\"fields\": [\"Duraci\\u00f3n del Temporizador (segundos)\"]}}]',30,3),(2,'2025-11-07 14:28:43.480731','4','EmpatÃ­a - Ver el DesafÃ­o',2,'[{\"changed\": {\"fields\": [\"Duraci\\u00f3n del Temporizador (segundos)\"]}}]',30,3),(3,'2025-11-07 14:28:58.971030','5','EmpatÃ­a - Bubble Map',2,'[{\"changed\": {\"fields\": [\"Duraci\\u00f3n del Temporizador (segundos)\"]}}]',30,3),(4,'2025-11-07 14:29:11.499569','6','Creatividad - Subida de Prototipo Lego',2,'[]',30,3),(5,'2025-11-07 14:29:29.885251','7','Comunicación - Formulario de Pitch',2,'[{\"changed\": {\"fields\": [\"Duraci\\u00f3n del Temporizador (segundos)\"]}}]',30,3),(6,'2025-11-07 14:29:46.274249','8','Comunicación - Presentación del Pitch',2,'[{\"changed\": {\"fields\": [\"Duraci\\u00f3n del Temporizador (segundos)\"]}}]',30,3),(7,'2025-11-17 07:41:19.187454','9','Gestión de residuos electrónicos - Sustentabilidad',2,'[{\"changed\": {\"fields\": [\"Imagen de la Persona\"]}}]',32,3),(8,'2025-11-17 07:44:09.893335','8','Acceso al agua en la agricultura - Sustentabilidad',2,'[{\"changed\": {\"fields\": [\"Imagen de la Persona\"]}}]',32,3),(9,'2025-11-17 07:46:31.244908','7','Contaminación por fast fashion - Sustentabilidad',2,'[{\"changed\": {\"fields\": [\"Imagen de la Persona\"]}}]',32,3),(10,'2025-11-17 07:47:53.286504','6','Tecnología adultos mayores - Educación',2,'[{\"changed\": {\"fields\": [\"Imagen de la Persona\"]}}]',32,3),(11,'2025-11-17 07:51:08.131752','5','Inicio de vida laboral - Educación',2,'[{\"changed\": {\"fields\": [\"Imagen de la Persona\"]}}]',32,3),(12,'2025-11-17 07:53:31.802725','4','Educación financiera accesible - Educación',2,'[{\"changed\": {\"fields\": [\"Imagen de la Persona\"]}}]',32,3),(13,'2025-11-17 07:55:32.570326','3','Envejecimiento activo - Salud',2,'[{\"changed\": {\"fields\": [\"Imagen de la Persona\"]}}]',32,3),(14,'2025-11-17 08:03:35.135282','2','Obesidad - Salud',2,'[{\"changed\": {\"fields\": [\"Imagen de la Persona\"]}}]',32,3),(15,'2025-11-17 08:07:58.159893','1','Autogestión de tratamientos - Salud',2,'[{\"changed\": {\"fields\": [\"Nombre de la Persona\", \"Imagen de la Persona\"]}}]',32,3),(16,'2025-11-23 16:54:10.231087','177','Sesión 6SM90U - Ingeniería de software',3,'',16,3),(17,'2025-11-23 16:58:33.699655','176','Sesión WCL4ZH - Ingeniería de software',3,'',16,3),(18,'2025-11-23 16:58:33.708885','175','Sesión HGXUHN - Ingeniería de software',3,'',16,3),(19,'2025-11-23 16:58:33.713913','174','Sesión PGQIB2 - Ingeniería de software',3,'',16,3),(20,'2025-11-23 16:58:33.716910','173','Sesión 8O72J9 - Ingeniería de software',3,'',16,3),(21,'2025-11-23 16:58:33.719912','172','Sesión JOIWHM - Ingeniería de software',3,'',16,3),(22,'2025-11-23 16:58:33.722405','171','Sesión 49AZVS - Ingeniería de software',3,'',16,3),(23,'2025-11-23 16:58:33.725411','170','Sesión K3RCFV - Ingeniería de software',3,'',16,3),(24,'2025-11-23 16:58:33.729415','169','Sesión 4TQXO5 - Ingeniería de software',3,'',16,3),(25,'2025-11-23 16:58:33.732146','168','Sesión IMHMXN - Ingeniería de software',3,'',16,3),(26,'2025-11-23 16:58:33.735772','167','Sesión MNUVO0 - Ingeniería de software',3,'',16,3),(27,'2025-11-23 16:58:33.738632','166','Sesión UKFFWK - Ingeniería de software',3,'',16,3),(28,'2025-11-23 16:58:33.741603','165','Sesión ES6FI6 - Ingeniería de software',3,'',16,3),(29,'2025-11-23 16:58:33.744611','164','Sesión HM8I9S - Ingeniería de software',3,'',16,3),(30,'2025-11-23 16:58:33.748600','163','Sesión BEYF6M - Ingeniería de software',3,'',16,3),(31,'2025-11-23 16:58:33.751745','162','Sesión YPKG73 - Ingeniería de software',3,'',16,3),(32,'2025-11-23 16:58:33.754716','161','Sesión GB6GR5 - Ingeniería de software',3,'',16,3),(33,'2025-11-23 16:58:33.757633','160','Sesión 1018D3 - Ingeniería de software',3,'',16,3),(34,'2025-11-23 16:58:33.761635','159','Sesión Z5W6N0 - Ingeniería de software',3,'',16,3),(35,'2025-11-23 16:58:33.765658','158','Sesión MFAJLB - Ingeniería de software',3,'',16,3),(36,'2025-11-23 16:58:33.768656','157','Sesión NVQUT9 - Ingeniería de software',3,'',16,3),(37,'2025-11-23 16:58:33.771662','156','Sesión PH60MF - Ingeniería de software',3,'',16,3),(38,'2025-11-23 16:58:33.773661','155','Sesión I79G2M - Ingeniería de software',3,'',16,3),(39,'2025-11-23 16:58:33.778669','154','Sesión B4LO8Q - Ingeniería de software',3,'',16,3),(40,'2025-11-23 16:58:33.781665','153','Sesión B0TLSM - Ingeniería de software',3,'',16,3),(41,'2025-11-23 16:58:33.785049','152','Sesión N55MXO - Ingeniería de software',3,'',16,3),(42,'2025-11-23 16:58:33.788049','151','Sesión XR3FPN - Ingeniería de software',3,'',16,3),(43,'2025-11-23 16:58:33.791121','150','Sesión 89PCVD - Ingeniería de software',3,'',16,3),(44,'2025-11-23 16:58:33.795014','149','Sesión 50W3MQ - Ingeniería de software',3,'',16,3),(45,'2025-11-23 16:58:33.798168','148','Sesión DPPM9G - Ingeniería de software',3,'',16,3),(46,'2025-11-23 16:58:33.801018','147','Sesión PWNHNG - Ingeniería de software',3,'',16,3),(47,'2025-11-23 16:58:33.805040','146','Sesión M1SXW6 - Ingeniería de software',3,'',16,3),(48,'2025-11-23 16:58:33.808068','145','Sesión VV2CHB - Ingeniería de software',3,'',16,3),(49,'2025-11-23 16:58:33.811084','144','Sesión 9J8T9Y - Ingeniería de software',3,'',16,3),(50,'2025-11-23 16:58:33.815111','143','Sesión 55SDB1 - Ingeniería de software',3,'',16,3),(51,'2025-11-23 16:58:33.817074','142','Sesión 8OK1MI - Ingeniería de software',3,'',16,3),(52,'2025-11-23 16:58:33.820073','141','Sesión 4KRANN - Ingeniería de software',3,'',16,3),(53,'2025-11-23 16:58:33.823073','140','Sesión H6KGNS - Ingeniería de software',3,'',16,3),(54,'2025-11-23 16:58:33.826661','139','Sesión O9L8FV - Ingeniería de software',3,'',16,3),(55,'2025-11-23 16:58:33.830665','138','Sesión GXCXLE - Ingeniería de software',3,'',16,3),(56,'2025-11-23 16:58:33.833665','137','Sesión K7PSIQ - Ingeniería de software',3,'',16,3),(57,'2025-11-23 16:58:33.836665','136','Sesión NW3CKS - Ingeniería de software',3,'',16,3),(58,'2025-11-23 16:58:33.839665','135','Sesión R56L3X - Ingeniería de software',3,'',16,3),(59,'2025-11-23 16:58:33.842354','134','Sesión MDNZVR - Ingeniería de software',3,'',16,3),(60,'2025-11-23 16:58:33.845682','133','Sesión ALKDKR - Ingeniería de software',3,'',16,3),(61,'2025-11-23 16:58:33.849063','132','Sesión M4U1R1 - Ingeniería de software',3,'',16,3),(62,'2025-11-23 16:58:33.852059','131','Sesión TW6YF4 - Ingeniería de software',3,'',16,3),(63,'2025-11-23 16:58:33.855158','130','Sesión DRTNB6 - Ingeniería de software',3,'',16,3),(64,'2025-11-23 16:58:33.858673','129','Sesión W70967 - Ingeniería de software',3,'',16,3),(65,'2025-11-23 16:58:33.862674','128','Sesión 52AE9M - Ingeniería de software',3,'',16,3),(66,'2025-11-23 16:58:33.865676','127','Sesión Y5ZU0C - Ingeniería de software',3,'',16,3),(67,'2025-11-23 16:58:33.868712','126','Sesión DJMPSK - Ingeniería de software',3,'',16,3),(68,'2025-11-23 16:58:33.871719','125','Sesión 8XM3XV - Ingeniería de software',3,'',16,3),(69,'2025-11-23 16:58:33.874719','124','Sesión 5NQ40Z - Ingeniería de software',3,'',16,3),(70,'2025-11-23 16:58:33.878720','123','Sesión ED47WE - Ingeniería de software',3,'',16,3),(71,'2025-11-23 16:58:33.881723','122','Sesión D2R68C - Ingeniería de software',3,'',16,3),(72,'2025-11-23 16:58:33.884263','121','Sesión ZB1ACG - Ingeniería de software',3,'',16,3),(73,'2025-11-23 16:58:33.887306','120','Sesión XGJOIH - Ingeniería de software',3,'',16,3),(74,'2025-11-23 16:58:33.889306','119','Sesión ZKS5R6 - Ingeniería de software',3,'',16,3),(75,'2025-11-23 16:58:33.892267','118','Sesión ISG8CJ - Ingeniería de software',3,'',16,3),(76,'2025-11-23 16:58:33.895270','117','Sesión HZ6T7O - Ingeniería de software',3,'',16,3),(77,'2025-11-23 16:58:33.898309','116','Sesión OLK4LC - Ingeniería de software',3,'',16,3),(78,'2025-11-23 16:58:33.901269','115','Sesión OYFI6I - Ingeniería de software',3,'',16,3),(79,'2025-11-23 16:58:33.903306','114','Sesión NOXZQA - Ingeniería de software',3,'',16,3),(80,'2025-11-23 16:58:33.906269','113','Sesión 6JYGVF - Ingeniería de software',3,'',16,3),(81,'2025-11-23 16:58:33.909306','112','Sesión TLOMZV - Ingeniería de software',3,'',16,3),(82,'2025-11-23 16:58:33.913318','111','Sesión 66VKZF - Ingeniería de software',3,'',16,3),(83,'2025-11-23 16:58:33.916307','110','Sesión 3QBENL - Ingeniería de software',3,'',16,3),(84,'2025-11-23 16:58:33.919310','109','Sesión COUGRE - Ingeniería de software',3,'',16,3),(85,'2025-11-23 16:58:33.921306','108','Sesión 2GK1LX - Ingeniería de software',3,'',16,3),(86,'2025-11-23 16:58:33.924269','107','Sesión O774QI - Ingeniería de software',3,'',16,3),(87,'2025-11-23 16:58:33.927277','106','Sesión 46AE84 - Ingeniería de software',3,'',16,3),(88,'2025-11-23 16:58:33.931306','105','Sesión HWV9NB - Ingeniería de software',3,'',16,3),(89,'2025-11-23 16:58:33.934307','104','Sesión XHZ27B - Ingeniería de software',3,'',16,3),(90,'2025-11-23 16:58:33.936307','103','Sesión G4IPH9 - Ingeniería de software',3,'',16,3),(91,'2025-11-23 16:58:33.939269','102','Sesión VOUGJQ - Ingeniería de software',3,'',16,3),(92,'2025-11-23 16:58:33.942308','101','Sesión CV48O1 - Ingeniería de software',3,'',16,3),(93,'2025-11-23 16:58:33.946270','100','Sesión T4SWI8 - Ingeniería de software',3,'',16,3),(94,'2025-11-23 16:58:33.948306','99','Sesión OSDNQ8 - Ingeniería de software',3,'',16,3),(95,'2025-11-23 16:58:33.951306','98','Sesión 0UU1VV - Ingeniería de software',3,'',16,3),(96,'2025-11-23 16:58:33.953317','97','Sesión BGN14P - Ingeniería de software',3,'',16,3),(97,'2025-11-23 16:58:33.956312','96','Sesión 0OTIWS - Ingeniería de software',3,'',16,3),(98,'2025-11-23 16:58:33.958269','95','Sesión QBTOYO - Ingeniería de software',3,'',16,3),(99,'2025-11-23 16:58:33.962275','94','Sesión 1XSW5Q - Ingeniería de software',3,'',16,3),(100,'2025-11-23 16:58:33.965269','93','Sesión VX6881 - Ingeniería de software',3,'',16,3),(101,'2025-11-23 16:58:33.968307','92','Sesión ZGDV58 - Ingeniería de software',3,'',16,3),(102,'2025-11-23 16:58:33.970350','91','Sesión FYM8MP - Ingeniería de software',3,'',16,3),(103,'2025-11-23 16:58:33.973350','90','Sesión JW3AZX - Ingeniería de software',3,'',16,3),(104,'2025-11-23 16:58:33.977319','89','Sesión KCMNJP - Ingeniería de software',3,'',16,3),(105,'2025-11-23 16:58:33.980350','88','Sesión TD6RFE - Ingeniería de software',3,'',16,3),(106,'2025-11-23 16:58:33.982351','87','Sesión BOH2LG - Ingeniería de software',3,'',16,3),(107,'2025-11-23 16:58:33.985940','86','Sesión UZJB05 - Ingeniería de software',3,'',16,3),(108,'2025-11-23 16:58:33.988940','85','Sesión 7FVMNC - Ingeniería de software',3,'',16,3),(109,'2025-11-23 16:58:33.990940','84','Sesión KONG5U - Ingeniería de software',3,'',16,3),(110,'2025-11-23 16:58:33.994903','83','Sesión HNQEBN - Ingeniería de software',3,'',16,3),(111,'2025-11-23 16:58:33.997903','82','Sesión VFS05A - Ingeniería de software',3,'',16,3),(112,'2025-11-23 16:58:34.000903','81','Sesión 9RMTT0 - Ingeniería de software',3,'',16,3),(113,'2025-11-23 16:58:34.003905','75','Sesión 0QE7J6 - Ingeniería de software',3,'',16,3),(114,'2025-11-23 16:58:34.006910','73','Sesión 7527AD - Ingeniería de software',3,'',16,3),(115,'2025-11-23 16:58:34.009904','72','Sesión 8UY9U5 - Ingeniería de software',3,'',16,3),(116,'2025-11-23 16:58:34.013938','71','Sesión KJI2XN - Ingeniería de software',3,'',16,3),(117,'2025-11-23 16:59:00.676900','70','Sesión UG4GVX - Ingeniería de software',3,'',16,3),(118,'2025-11-23 16:59:00.681166','69','Sesión NYS8W7 - Ingeniería de software',3,'',16,3),(119,'2025-11-23 16:59:00.684239','68','Sesión HZ6LGV - Ingeniería de software',3,'',16,3),(120,'2025-11-23 16:59:00.689281','67','Sesión IE56ZQ - Ingeniería de software',3,'',16,3),(121,'2025-11-23 16:59:00.692310','66','Sesión AIP76D - Ingeniería de software',3,'',16,3),(122,'2025-11-23 16:59:00.695287','65','Sesión 3V629B - Ingeniería de software',3,'',16,3),(123,'2025-11-23 16:59:00.698886','64','Sesión 0M40S1 - Ingeniería de software',3,'',16,3),(124,'2025-11-23 16:59:00.701893','63','Sesión EAYSVK - Ingeniería de software',3,'',16,3),(125,'2025-11-23 16:59:00.705861','62','Sesión 04EUKW - Ingeniería de software',3,'',16,3),(126,'2025-11-23 16:59:00.707863','61','Sesión T41XRS - Ingeniería de software',3,'',16,3),(127,'2025-11-23 16:59:00.710899','60','Sesión QMI015 - Ingeniería de software',3,'',16,3),(128,'2025-11-23 16:59:00.712861','59','Sesión EQQ4AY - Ingeniería de software',3,'',16,3),(129,'2025-11-23 16:59:00.715860','58','Sesión X692YV - Ingeniería de software',3,'',16,3),(130,'2025-11-23 16:59:00.719863','57','Sesión KLXRTQ - Ingeniería de software',3,'',16,3),(131,'2025-11-23 16:59:00.722898','56','Sesión PQLTYX - Ingeniería de software',3,'',16,3),(132,'2025-11-23 16:59:00.726861','55','Sesión FU6MWD - Ingeniería de software',3,'',16,3),(133,'2025-11-23 16:59:00.729945','54','Sesión WVHS2C - Ingeniería de software',3,'',16,3),(134,'2025-11-23 16:59:00.732941','53','Sesión Y7RLYO - Ingeniería de software',3,'',16,3),(135,'2025-11-23 16:59:00.735910','52','Sesión OKMGFR - Ingeniería de software',3,'',16,3),(136,'2025-11-23 16:59:00.738906','51','Sesión WTTOIV - Ingeniería de software',3,'',16,3),(137,'2025-11-23 16:59:00.741942','50','Sesión 6MRIVM - Ingeniería de software',3,'',16,3),(138,'2025-11-23 16:59:00.744488','49','Sesión M9ZPX7 - Ingeniería de software',3,'',16,3),(139,'2025-11-23 16:59:00.747534','48','Sesión 7ADVSA - Ingeniería de software',3,'',16,3),(140,'2025-11-23 16:59:00.753505','47','Sesión TYHUG0 - Ingeniería de software',3,'',16,3),(141,'2025-11-23 16:59:00.757495','46','Sesión 2WVQAU - Ingeniería de software',3,'',16,3),(142,'2025-11-23 16:59:00.761495','45','Sesión O0JKIW - Ingeniería de software',3,'',16,3),(143,'2025-11-23 16:59:00.765519','44','Sesión 259WGV - Ingeniería de software',3,'',16,3),(144,'2025-11-23 16:59:00.768535','43','Sesión OWU2OP - Ingeniería de software',3,'',16,3),(145,'2025-11-23 16:59:00.771496','42','Sesión 560JOE - Ingeniería de software',3,'',16,3),(146,'2025-11-23 16:59:00.774521','41','Sesión LF8Q0I - Ingeniería de software',3,'',16,3),(147,'2025-11-23 16:59:00.778524','40','Sesión BSDFNY - Ingeniería de software',3,'',16,3),(148,'2025-11-23 16:59:00.781493','39','Sesión GHVCK6 - Ingeniería de software',3,'',16,3),(149,'2025-11-23 16:59:00.784497','38','Sesión 4EM2GB - Ingeniería de software',3,'',16,3),(150,'2025-11-23 16:59:00.788496','37','Sesión FJP4HQ - Ingeniería de software',3,'',16,3),(151,'2025-11-23 16:59:00.791531','36','Sesión W4P5CU - Ingeniería de software',3,'',16,3),(152,'2025-11-23 16:59:00.794494','35','Sesión 8DU1PF - Ingeniería de software',3,'',16,3),(153,'2025-11-23 16:59:00.796532','34','Sesión QAXC5T - Ingeniería de software',3,'',16,3),(154,'2025-11-23 16:59:00.799532','33','Sesión 87EQXI - Ingeniería de software',3,'',16,3),(155,'2025-11-23 16:59:00.803509','32','Sesión AZGDWW - Ingeniería de software',3,'',16,3),(156,'2025-11-23 16:59:00.806534','31','Sesión I2NTWK - Ingeniería de software',3,'',16,3),(157,'2025-11-23 16:59:00.809531','30','Sesión 7CNF6S - Ingeniería de software',3,'',16,3),(158,'2025-11-23 16:59:00.811536','29','Sesión 15A50H - Ingeniería de software',3,'',16,3),(159,'2025-11-23 16:59:00.814532','28','Sesión X54BX7 - Ingeniería de software',3,'',16,3),(160,'2025-11-23 16:59:00.818523','27','Sesión 6PP6N9 - Ingeniería de software',3,'',16,3),(161,'2025-11-23 16:59:00.821501','26','Sesión V7H9DL - Ingeniería de software',3,'',16,3),(162,'2025-11-23 16:59:00.825531','25','Sesión L6DPBN - Ingeniería de software',3,'',16,3),(163,'2025-11-23 16:59:00.827532','24','Sesión 2CY1HK - Ingeniería de software',3,'',16,3),(164,'2025-11-23 16:59:00.830587','23','Sesión UJZ02H - Ingeniería de software',3,'',16,3),(165,'2025-11-23 16:59:00.832538','22','Sesión I8GNUI - Ingeniería de software',3,'',16,3),(166,'2025-11-23 16:59:00.836539','21','Sesión D0HPJR - Ingeniería de software',3,'',16,3),(167,'2025-11-23 16:59:00.841573','20','Sesión 21X50C - Ingeniería de software',3,'',16,3),(168,'2025-11-23 16:59:00.846133','19','Sesión HL6C1Z - Ingeniería de software',3,'',16,3),(169,'2025-11-23 16:59:00.849132','18','Sesión GWXCYH - Ingeniería de software',3,'',16,3),(170,'2025-11-23 16:59:00.852099','17','Sesión KT60AK - Ingeniería de software',3,'',16,3),(171,'2025-11-23 16:59:00.856093','16','Sesión F97X5Q - Ingeniería de software',3,'',16,3),(172,'2025-11-23 16:59:00.860128','15','Sesión E6PE97 - Ingeniería de software',3,'',16,3),(173,'2025-11-23 16:59:00.863089','14','Sesión W5B1BT - Ingeniería de software',3,'',16,3),(174,'2025-11-23 16:59:00.866129','13','Sesión X2DNLJ - Ingeniería de software',3,'',16,3),(175,'2025-11-23 16:59:00.871091','12','Sesión DNYHSB - Ingeniería de software',3,'',16,3),(176,'2025-11-23 16:59:00.874127','11','Sesión SPUGDT - Ingeniería de software',3,'',16,3),(177,'2025-11-23 16:59:00.877129','10','Sesión YJH6N4 - Ingeniería de software',3,'',16,3),(178,'2025-11-23 16:59:00.880092','9','Sesión T0OIBH - Ingeniería de software',3,'',16,3),(179,'2025-11-23 16:59:00.883128','8','Sesión 1E31JF - Ingeniería de software',3,'',16,3),(180,'2025-11-23 16:59:00.886109','7','Sesión PSGMOS - Ingeniería de software',3,'',16,3),(181,'2025-11-23 16:59:00.889091','6','Sesión RSZ8FN - Ingeniería de software',3,'',16,3),(182,'2025-11-23 16:59:00.893107','5','Sesión 92JPB3 - Ingeniería de software',3,'',16,3),(183,'2025-11-23 16:59:00.896091','4','Sesión OPS3HS - Ingeniería de software',3,'',16,3),(184,'2025-11-23 16:59:00.899128','3','Sesión IQXV9G - Ingeniería de software',3,'',16,3),(185,'2025-11-23 16:59:00.902094','2','Sesión IGIOAK - Ingeniería de software',3,'',16,3),(186,'2025-11-23 16:59:00.905092','1','Sesión FM21R3 - Ingeniería de software',3,'',16,3);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (14,'academic','career'),(15,'academic','course'),(13,'academic','faculty'),(1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(8,'axes','accessattempt'),(7,'axes','accessfailurelog'),(9,'axes','accesslog'),(30,'challenges','activity'),(29,'challenges','activitytype'),(32,'challenges','challenge'),(35,'challenges','learningobjective'),(34,'challenges','minigame'),(33,'challenges','roulettechallenge'),(28,'challenges','stage'),(31,'challenges','topic'),(38,'challenges','wordsearchoption'),(5,'contenttypes','contenttype'),(16,'game_sessions','gamesession'),(27,'game_sessions','peerevaluation'),(36,'game_sessions','reflectionevaluation'),(37,'game_sessions','sessiongroup'),(20,'game_sessions','sessionstage'),(23,'game_sessions','tablet'),(24,'game_sessions','tabletconnection'),(17,'game_sessions','team'),(21,'game_sessions','teamactivityprogress'),(22,'game_sessions','teambubblemap'),(19,'game_sessions','teampersonalization'),(25,'game_sessions','teamrouletteassignment'),(18,'game_sessions','teamstudent'),(26,'game_sessions','tokentransaction'),(6,'sessions','session'),(10,'users','administrator'),(11,'users','professor'),(12,'users','student');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'academic','0001_initial','2025-11-07 11:18:50.379498'),(2,'contenttypes','0001_initial','2025-11-07 11:18:50.445360'),(3,'auth','0001_initial','2025-11-07 11:18:51.391086'),(4,'admin','0001_initial','2025-11-07 11:18:51.573167'),(5,'admin','0002_logentry_remove_auto_add','2025-11-07 11:18:51.573167'),(6,'admin','0003_logentry_add_action_flag_choices','2025-11-07 11:18:51.597177'),(7,'contenttypes','0002_remove_content_type_name','2025-11-07 11:18:51.750732'),(8,'auth','0002_alter_permission_name_max_length','2025-11-07 11:18:51.843983'),(9,'auth','0003_alter_user_email_max_length','2025-11-07 11:18:51.875687'),(10,'auth','0004_alter_user_username_opts','2025-11-07 11:18:51.881266'),(11,'auth','0005_alter_user_last_login_null','2025-11-07 11:18:51.965334'),(12,'auth','0006_require_contenttypes_0002','2025-11-07 11:18:51.968298'),(13,'auth','0007_alter_validators_add_error_messages','2025-11-07 11:18:51.979752'),(14,'auth','0008_alter_user_username_max_length','2025-11-07 11:18:52.056842'),(15,'auth','0009_alter_user_last_name_max_length','2025-11-07 11:18:52.158767'),(16,'auth','0010_alter_group_name_max_length','2025-11-07 11:18:52.181613'),(17,'auth','0011_update_proxy_permissions','2025-11-07 11:18:52.197385'),(18,'auth','0012_alter_user_first_name_max_length','2025-11-07 11:18:52.291638'),(19,'axes','0001_initial','2025-11-07 11:18:52.374330'),(20,'axes','0002_auto_20151217_2044','2025-11-07 11:18:52.557407'),(21,'axes','0003_auto_20160322_0929','2025-11-07 11:18:52.579574'),(22,'axes','0004_auto_20181024_1538','2025-11-07 11:18:52.595128'),(23,'axes','0005_remove_accessattempt_trusted','2025-11-07 11:18:52.741237'),(24,'axes','0006_remove_accesslog_trusted','2025-11-07 11:18:52.881329'),(25,'axes','0007_alter_accessattempt_unique_together','2025-11-07 11:18:52.925243'),(26,'axes','0008_accessfailurelog','2025-11-07 11:18:53.051456'),(27,'axes','0009_add_session_hash','2025-11-07 11:18:53.126104'),(28,'challenges','0001_initial','2025-11-07 11:18:54.205720'),(29,'challenges','0002_add_challenge_icon_and_persona','2025-11-07 11:18:54.558015'),(30,'challenges','0003_remove_user_story_field','2025-11-07 11:18:54.628065'),(31,'challenges','0004_add_challenge_description','2025-11-07 11:18:54.698822'),(32,'challenges','0005_add_topic_icon','2025-11-07 11:18:54.780506'),(33,'users','0001_initial','2025-11-07 11:18:55.141011'),(34,'game_sessions','0001_initial','2025-11-07 11:18:59.542900'),(35,'game_sessions','0002_remove_duplicate_progress','2025-11-07 11:18:59.582185'),(36,'game_sessions','0003_alter_teamactivityprogress_unique_together','2025-11-07 11:18:59.628524'),(37,'game_sessions','0004_teambubblemap','2025-11-07 11:18:59.890476'),(38,'game_sessions','0005_sessionstage_current_presentation_team_id_and_more','2025-11-07 11:19:00.107282'),(39,'game_sessions','0006_sessionstage_presentation_state','2025-11-07 11:19:00.223904'),(40,'game_sessions','0007_sessionstage_presentation_timestamps','2025-11-07 11:19:00.339952'),(41,'sessions','0001_initial','2025-11-07 11:19:00.390621'),(42,'game_sessions','0008_reflectionevaluation','2025-11-14 06:31:16.913363'),(43,'game_sessions','0009_reflectionevaluation_faculty_and_more','2025-11-14 06:39:16.895203'),(44,'game_sessions','0010_sessiongroup_gamesession_session_group_and_more','2025-11-14 12:05:36.087470'),(45,'game_sessions','0011_teamactivityprogress_pitch_value_and_pitch_impact','2025-11-15 22:05:36.320616'),(46,'game_sessions','0012_alter_teamactivityprogress_pitch_intro_problem','2025-11-15 23:34:58.092335'),(47,'challenges','0006_wordsearchoption','2025-11-16 19:13:29.503264'),(48,'challenges','0007_challenge_persona_image','2025-11-17 07:35:33.887503'),(49,'game_sessions','0013_gamesession_cancellation_reason_and_more','2025-11-18 05:12:55.461861'),(50,'game_sessions','0014_gamesession_game_sessio_created_7179a2_idx_and_more','2025-11-23 16:57:36.631764');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('k17x8ob20bhs6gfi7f2yqa8j9bvgxxgn','.eJxVjDsOwyAQRO9CHSEMrGFTpvcZ0PILTiKQjF1FuXtsyUUy5bw382aOtrW4rafFzZFdmWKX385TeKZ6gPigem88tLous-eHwk_a-dRiet1O9--gUC_7OmQLqJSOniJkDDIrm0aBEgdrUkaNMA4mSwFoNKCNXghLJPZkCDawzxfW5zcw:1vKtkT:B1fPQ6E1T6NRYbCKcKFQ8Mer5zCKczky3Podec5iSqM','2025-12-01 07:34:05.501190'),('wra90wm6vxaly2an4y0mmn9cu2uzm7ie','.eJxVjDsOwyAQRO9CHSEMrGFTpvcZ0PILTiKQjF1FuXtsyUUy5bw382aOtrW4rafFzZFdmWKX385TeKZ6gPigem88tLous-eHwk_a-dRiet1O9--gUC_7OmQLqJSOniJkDDIrm0aBEgdrUkaNMA4mSwFoNKCNXghLJPZkCDawzxfW5zcw:1vHNPv:nEs0BoM9sqSCs00TAfUvJ6sX7NcZTboQ23E6L9cApms','2025-11-21 14:26:19.704717');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculties`
--

DROP TABLE IF EXISTS `faculties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculties` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`),
  KEY `faculties_is_acti_5069b3_idx` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculties`
--

LOCK TABLES `faculties` WRITE;
/*!40000 ALTER TABLE `faculties` DISABLE KEYS */;
INSERT INTO `faculties` VALUES (1,'Ingeniería',NULL,1,'2025-11-04 00:40:34.190000','2025-11-04 00:40:34.190000');
/*!40000 ALTER TABLE `faculties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_sessions`
--

DROP TABLE IF EXISTS `game_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_code` varchar(50) NOT NULL,
  `qr_code` longtext,
  `status` varchar(20) NOT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `ended_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `course_id` bigint NOT NULL,
  `current_activity_id` bigint DEFAULT NULL,
  `current_stage_id` bigint DEFAULT NULL,
  `professor_id` bigint NOT NULL,
  `session_group_id` bigint DEFAULT NULL,
  `cancellation_reason` varchar(50) DEFAULT NULL,
  `cancellation_reason_other` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_code` (`room_code`),
  KEY `game_sessio_profess_2d4bd5_idx` (`professor_id`),
  KEY `game_sessio_room_co_529049_idx` (`room_code`),
  KEY `game_sessio_status_381f09_idx` (`status`),
  KEY `game_sessio_status_972612_idx` (`status`,`started_at`),
  KEY `game_sessions_current_activity_id_0a0772c5_fk_activities_id` (`current_activity_id`),
  KEY `game_sessions_current_stage_id_445084f8_fk_stages_id` (`current_stage_id`),
  KEY `game_sessions_session_group_id_836e533a_fk_session_groups_id` (`session_group_id`),
  KEY `game_sessio_created_7179a2_idx` (`created_at`),
  KEY `game_sessio_course__601678_idx` (`course_id`),
  CONSTRAINT `game_sessions_course_id_9d225134_fk_courses_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `game_sessions_current_activity_id_0a0772c5_fk_activities_id` FOREIGN KEY (`current_activity_id`) REFERENCES `activities` (`id`),
  CONSTRAINT `game_sessions_current_stage_id_445084f8_fk_stages_id` FOREIGN KEY (`current_stage_id`) REFERENCES `stages` (`id`),
  CONSTRAINT `game_sessions_professor_id_698ca57b_fk_professors_id` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`),
  CONSTRAINT `game_sessions_session_group_id_836e533a_fk_session_groups_id` FOREIGN KEY (`session_group_id`) REFERENCES `session_groups` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_sessions`
--

LOCK TABLES `game_sessions` WRITE;
/*!40000 ALTER TABLE `game_sessions` DISABLE KEYS */;
INSERT INTO `game_sessions` VALUES (178,'3Z2EQJ','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYYAAAGGAQAAAABX+xtIAAACfUlEQVR4nO2cQa7bIBCGvymWsiRSDvCOYt+gR6rezeyj9ACV8DISaLoAHOeli6YVdmINK9vkUwaRYeYfcER5rqVvTwJghBFGGGGEEUYYYUQTYpLSAJABEDmDDKTadd7cKiOaEKiqqo5eVVVjvcXlfF5HH7985DXHYcQ/EGnx5CTgY34qA+RVYB+rjGhAdI+PnAoIOn3/1SmkHawyYltiFtFxuZvOLb7DiD2Jh3ier4JT8Kpg8fywxCwiIh1AEqaPq+hIyh6f0/ZhB6uMaEEUJ1617OIRHf/Ua37+/sRq4aYPUEK5v1Ntvc35kYjqyQFWUzsCqsHljnxl8fwoxDLnZUWn10ePH2H5Rdicvz1R9bm/CuCUSVwEXAQfEOaTyh3xmuMw4on2WHstoRxYr+1ga/vxCBnmk5YC7NzlUrsMOAV/lRzyt7fKiHZEEv3Mqnxpc1dC+XQu22ybW2VEA2KlwOmXRH3ELTItQh9ugs3W9rcnSg43DS4qXEVz+kYS+nAB5ovCvLFVRrQk1vq8ZGk1mxu9qo5Vv5k+PxoxfURgFiHvn8+nLNJLmztk2N4qI5oQX+N5CduhnpPJHaqm1Y5D3OnzUNK3ck7Ga33hYSm/25wfgHjYOcvZenCl6H4L6ubnByNu5177kEQ/z0mqn6dSlK3h/aXHYcRftKXeHgBSxzS4KH245EOQgneaO7a0yoiWxBLPIzVsR3IlBm6baysR95rjMOI/iElOyiRd3WjxRcTJsKdVRrQksov7WI+8zqeS1X+ed7TKiBaEq8W4vLPilP6nrN9u+BF2sMqIBsRy7K3e5sheBVtO3m2P5VCE2P9MGGGEEUYYYYQRRrwd8Rt2Dk5Hl4iBBgAAAABJRU5ErkJggg==','cancelled','2025-11-23 17:03:55.082570','2025-11-23 17:23:41.571712','2025-11-23 17:03:30.489332','2025-11-23 17:23:41.634320',1,8,4,9,NULL,'Faltó tiempo',NULL),(179,'BB26GD','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYYAAAGGAQAAAABX+xtIAAACJ0lEQVR4nO2cQW7jMAxFP0cGurRvMEdRj24dJTdQ9jY4C4qyEncxGUzSlPhaGLDdB8j4Jb9EChHFY2P/9SAAkCBBggQJEiRIkHgKUaQN4CqCsgAiCyCf2P3V8vJZkXgKAVVV1XVWVdUNuiIpMKsiVwCYt7s/ec/vIPEPxN4iOVcAue6C8ntrt0VEvmdWJF5D7IKyJItzXd9lViSeR5Qlqa5ocncX/+ZZkfiPxMnP+wW5JkVW+nk0wgXtt+u83V/aoOZBiKb5ODao1qSqFUA+vX3P7yDxwPDE7YGtte3VdEXSI627+tT8xxMe57Xra4+TAmjBbm/p51GIUfMV8JWb53ZT2kydmgch+hou3Qe7VeSy/TMk5vY4RF/Dnfwct7mdcR6NKPJhIssndkG+TG2T3sYufTv31t9B4m/GsQuz+kvvsTQr7y0XxnkUYvBzW74BzcDdxY+KHDWPQYya91tTevBzZZwHIm7qcF5gv6nJeA2e+/MoxNhAWdHrL0MJznM74zwK0WsysNq62bYVW+0Z/TwaMcT53WEowD3eQ5yaxyBOfTXrtqAfnJg9wTO3RyFO/fNjp95W6zd7dmoeiGiCArhOQBG/WIKf/TTki2dF4hnE0D9vMT1v8P15PwNJP49EnDS3YJ/bhtzLrvTzyESRD0W+TACuE1Qvkz1njyUM8cW5135bj3U7z0YFIr4+96pHt8XsnfX2QITwdyZIkCBBggQJEiR+HPEHgVj715MpZlcAAAAASUVORK5CYII=','completed','2025-11-23 17:54:50.585871','2025-11-23 18:17:41.517022','2025-11-23 17:24:38.923640','2025-11-23 18:17:41.517022',1,NULL,4,9,24,'Problemas técnicos',NULL),(180,'OE8D5L','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYYAAAGGAQAAAABX+xtIAAACcUlEQVR4nO2cTarbMBCAv6kMWcrwDtCjyDfokcq7mX2Ud4CCvHxgM11IspWXLhpaO4kYLUyI/JER4/n1EFHuW+u3OwEwwggjjDDCCCOMMOIQYpK8AJBh7hDpQQbWstWfLpURhxCoqqqOXlVVF1QjgFclRNDRL19uec5zGPH3qysf1g78L8Av6TtlBsED0wBbTfec5zDiX4i5A2YRGfxm9o+XyogzCH3vgak/8jeMeASx+XanwArT4BaY3xbBO02+PdTNuuc8hxH3E7OIiHSA/xSm75+iI6voCKS0fXiAVEYcQeSk/MtKOXr8067l7S9PVIVYKc5UCdEpeFUdcUownbdEbJZcynCNboverhh7dFaft0Nsmr7uv+BURwD8QvoUzM4bIUre7hUJH5ds4iG+AT4izBeV06Uy4kjiKp7rQrrgVbn27Sm8m503QFTxvHTZXbrs2Vwd7U3nr09UmVul2jFFcaclfctPhOm8BaJSctZqdFsO54q/j3vBZjp/eaKu0EKEomSovLyazlsiqlotaXX0qrlC88UBbBum8xaIXKtNPxTJL9HXTpkv2ezTSq9czpPKiCOJuqOeDHsL5dsuQdVqtXaIq8GnCECdqOebvNVqDRE3b872Mm2EOqibnTdG7HOvIeZp12LnqwBuD+9PfQ4j7iB8acblYagcz2XIAzRyQ5whlRFHENc9mYW9I5d2R6A8EebbGyWmfhWYu5yy4xfyGOwjpTLiSGKvypOXny85q3/vHyiVEf+RuJl7xS+d4BXCh6D4mPbFcrjWiG3udZJLlb7JAMjPj+6WOEMqI44gxP5nwggjjDDCCCOMMOLliN8ozV/lahkFRQAAAABJRU5ErkJggg==','completed','2025-11-23 17:31:30.374670','2025-11-23 17:45:38.999579','2025-11-23 17:24:39.100777','2025-11-23 17:45:38.999579',1,NULL,4,9,24,NULL,NULL),(181,'OD7EYZ','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYYAAAGGAQAAAABX+xtIAAACRUlEQVR4nO2cTYrjMBBGX421t2EOkKM4V5ub2UfpAzTYywaZmoUkR+4MAxnaSY/4tAj64YFMqVSlTyLmPFa2Hw8CIEKECBEiRIgQIeIUYrZcmIfN7LoG7JqGtjI0PH1WIk4hcHd3n3p3d4/Hpjvj5774Pb9DxD8QW/Hk1Sw1r2uAeSDtAq+ZlYhnEPMlwrgA8+XDUu31sxJxLtG5mQV8AvzX8E1mJeLLiFAqnQMbsBpAFwEwemCsxbrv+R0iHidWMzMLQB/xqf9IAdwnIKXt1xfMSsQZRE7Kb2UCkuF9uR9V3t4AUR/Epj7mvonOGZfOSw7X6azWDlE8eclWZXR3KEvgtg5Sn2zeAFH8fG+PXgw/lsWQavLzVohQN/oFgy0wD+/BWX9GYDOfhyVn8E+alYgziX1vJysxo0egiufdrsLKz9sgqr39Zv0c2VOtLAHF81aIg6Uh+XnK26tRjyieN0Mc9vY9aUs+fdjW5efNELXNIW/mJbzv8XxP3mXzBog9nhfTptJHsgqbmvLzhohKXS09xfDjArdAr3jeDHHI0orECoccTvG8LeJwVlsgy67lfF4EOuntDRH392pHgX06/sjm7RC3d6+7TzO+mdmVzcobuafPSsQpxB/evZaUfb9ryxKN/LwRgnpHP16e1s8fFc9bJsa3kPX2eYByxxL/QjxjViK+kAh3PX0MsIYI/Xvw+ZLNrbvUZoj7eL7USkwR4xTPGyI+v5PJervHrLfTe7lJl97eCGH6nwkRIkSIECFChIj/jvgNJhGPzLBdQH4AAAAASUVORK5CYII=','completed','2025-11-23 18:26:34.461883','2025-11-23 18:34:28.150928','2025-11-23 18:18:25.031791','2025-11-23 18:34:28.150928',1,NULL,4,9,25,'Cambio de planes',NULL),(182,'3R2UHZ','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYYAAAGGAQAAAABX+xtIAAACd0lEQVR4nO2cQYrjMBBFf40MvZRhDjBHUW4wR5qr2QcaUJYBmz+LkmzRmUUb2o5jvhbBkf1AolLWry91G7GtzT82AoAIESJEiBAhQoSIXYjRSgMwm5l1wGgd6lczs/7wUYnYlYgkyQkYe4DMANL6lSSHF4xKxK7EvGYygDiVvhvgb4HXjErEIcS9g9386uN/xfu7zEPEl4lEEmM/m9mvhyHlU4xKxDcSXb0IBDA3dzj+BjzRU5vv55yHiO3E3apa72db9JprOJfttxeMSsQeRMnz9LxyW8ogUsanW+ech4gNrRRitVbjEEkv04DgFVot3fyRc85DxNfbsp7PHRAzDRHgaAAQ/xoQMwxxWp476TxEbGievcyAezIpo4h3v5uB+hZQnl+DWEy2wGLG5eBdQJz8bn2tK+bXILBGEykDHOIED/y6sqd2yT/nPERsaI2GGxCKkHPRllFMd7diFfOLEI2Go4s2d2fCZIhtlbZcn3MeIrYT7rIHcoiPYrsCs2G0j7KlNvbHj0rEHsSi24OLNpfsqfY1hbs03FWIZj1HyoG1TFt+Anl5Uuv5RYj2QESqPlyV8YHtI4r5RYgloKvtWvK8MWvkyVyKaGPODABNwRaqWFetdiWi8WTalb06MR7pYU17xfz9iU8HHGt2Ry4fE8rmmmJ+MaKWZOvxRwCzFSMegU/EEaMSsQfRrOd1U6VUaKXPW6D2zy9DdE89958EMHUGdOB4CxNw741jnw8blYhjifgw/xMWr8/diiXtT37lqER8H/F0NqoUbIBrON9cy2uRrnf72xNPun3wU3CB5fSE+7Hy2y9EmP7PhAgRIkSIECFCxNsR/wCkPk1FLleAWQAAAABJRU5ErkJggg==','completed','2025-11-23 18:19:18.603184','2025-11-23 18:23:03.675026','2025-11-23 18:18:25.145603','2025-11-23 18:23:03.675026',1,NULL,4,9,25,NULL,NULL),(183,'TSC23S','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYYAAAGGAQAAAABX+xtIAAACJ0lEQVR4nO2cS27DMAxER3WALu0buUe3j9IbqHsb0wUpyZ9ugsL5EKNF4MR4gIIxyRGlJBH3jfXjTgAQIUKECBEiRIgQcQkxJx8AgJSG1a++sJZbw8NnJeJSoidJLqY+gI72CMwDQJLk9IRZibiUWD2Sx6ZvvwBjRn0OnjArERcQt78+TOj96o/V+2t+DxH/IOZhTWQGyAzUKv7kWYm4guhIZgBj7pjSAKSvn09abh9JnolHzErEBcTBoIFTvxxffLjNe83vIeKOwePIAJk7D+zxeFuavz1R4rwGNnNnYW9Xfpcs6kvztydKnGfAsvcEt2+oNd6fA+X2IETN7aVsjyWtm9xT71lA9TwMsdO8JwEUzSd0xGipvlNuj0Pscru9XSy6sc/tivMwRNW8+TXvuO5sfMny0jwAsVmfN7lNcyvl8BBXnIchNutz9+22YKv1nIv7OtXzKMRufQ4U327dt1rPqTgPRBz7cED16BM6M/TN10nzCESN81rU6wpta+nk2wMRG9/erJq9+Jaa6nk0YlPPbVR9UbszJcSleQzitK/W2jET1HsNSZz2z92vLdWtL2iLdGkeiXBBAfPt3zdgTjd/205DPnhWIq4gdvW8LdLLNls5Aat6Hog4aW65HSgbLT1Li0a5PSoxp8+i9M8N5LefhtZvGsIQ256M99xYejK5+XadjQpEnM+9lo4rbMHWL+Wss3J7ECLpfyZEiBAhQoQIESLejvgFJNDKzrGj3VAAAAAASUVORK5CYII=','completed','2025-11-23 18:43:37.274267','2025-11-23 18:46:02.471335','2025-11-23 18:37:05.505667','2025-11-23 18:46:02.471335',1,NULL,4,9,26,NULL,NULL),(184,'MUXXMC','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYYAAAGGAQAAAABX+xtIAAACWklEQVR4nO2cS26jQBCGv5q2lCVIc6DmanMzOEoOEKmzB9Us+gEx2XgBmWn9vbBszCeVVa532ea8drZfLwIgQoQIESJEiBAh4hJisXJYxs0AsOnzAbDVt8bbpRJxCYG7u/s8uLv7insKDoO7z8NKfvhyy7/5OUS8cKpCV6ApeQaICfL3YAak826Ix/OF+P7Aom8PX0awOP+EVCKuJE46h7ACwS2mEV/Gjx+QSsSVxCmeFy//NcYrnvdIfJqZWbF6n9kM2IxlhJy2Tz8glYgriGLE3509ZT8e2XkvRKnKN7OJzWppHtwmwKZq8TdLJeISonjznK3PwVkMfBlDu2N7AMGN4T6pRFxJVO+dgh/L8BSc6CtAyNNW5XDdEIeITSwRG2jJu7v7/kw674GohRiQ+3C590rIxVk29qharSfiOTPnoO7m4LOXl847IVo8p7bVoTZmaNOW+j2QznsgWu81d1xXi+n3Wi4NCefT8OjkkctdUom4kjg2Vuf9WiqJevHtSXbeHxHTZkBwYgKbajsG2uLEdL9UIi4hWt4evM7PS3GWc7jDLbLzToiWt1cXvtdqZW3mKbWXznshFntzWr89R/ZlDF7nag9sul8qEZcQp8lZq8sOzbgZ9V77I/a9V4YV4rsZ8f3NyyR9cH8m7pBKxCXEee+1hfd9WWbO4V123gdx2nvNI7W0N+OAXMRJ550QZ53vLwk1vKN43hFx2ntdJvIKBQwJizWQa2eiG+Kb37FUt37cmVA875Boe6/LWJX8Jz/bzD2B9uG6IUz/MyFChAgRIkSIEPHfEX8BJwOURPm/QPIAAAAASUVORK5CYII=','completed','2025-11-23 18:37:54.542819','2025-11-23 18:42:02.135921','2025-11-23 18:37:05.632632','2025-11-23 18:42:02.135921',1,NULL,4,9,26,NULL,NULL),(185,'4VSB75','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYYAAAGGAQAAAABX+xtIAAACJ0lEQVR4nO2cQY7iMBBFf03YOzeYo4SjJ0fpA7SU7IP+LFxlTGc2aCZNU/peQEx4ktFP1bfLFkY8126/ngQAESJEiBAhQoQIEacQi3kDcDOz0W/bFbe4NX77qEScShSS5A4sI0CugF03M++S5PyCUYk4lYjonlZU4YGyR7cmgBeMSsQJxOXwyTYC2AxYxk/8ZfX+M3+HiH8glt877Fp2T/DN2V87KhH/kQizDj+PFxLTOhBTdNtXfubvEPFEe5yggXPZv754k+ZJCNf8sdUQBwBMX+9J87cnWuKOwGbITa4D72k91Jfmb090cY5pHXjQfI0r+XkWovn5UIO9Cj8j5J6LZwH5eRqixfkOFx5eh+OMgfdHQLk9DRGaRx4HClmrb0Cf2xXnaYhu8e2z9cII9vowtLCX5kmI3s89o8NXaNXK4c+B4jwN0ef2Kjy9CBMu7vM6+XkaoqvDhZ/fq2/Nz6k4z0dMK2BXDAS2C4CYwdcNVeBm2j9PQzzU4Wq3hXjc6CZ3ivMExONaLfx8YizY5Of5iD7Oq58DrjkQGy0e4tI8B3HYV5uLy11TvWqv+YjD/rnP0ff+qi3SpXkmwgWtHc7bBVjMZ/DdachvHpWIM4jOzyOm0Z2OiQWb/DwRcdDcizA73NmLJ3jl9rzEMg40G706Q374aWjVZNIQx3OvKxAnZu7zdp2NSkQcz73W9yEWbCVKNMrtWQjT/0yIECFChAgRIkS8HfEHcArVEIqHpAEAAAAASUVORK5CYII=','completed','2025-11-23 18:52:44.853954','2025-11-23 18:54:26.615887','2025-11-23 18:46:36.909478','2025-11-23 18:54:26.615887',1,NULL,4,9,27,NULL,NULL),(186,'LF58NH','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYYAAAGGAQAAAABX+xtIAAACZ0lEQVR4nO2cTY7iMBCFX40jsXRu0EdJbjbiZslRuIGzbMlR9aLKTuiexTCaBLCeFwgwn6io9OovBlE8ttZfDwIACRIkSJAgQYIEiUOIWXwBSwfMPSDSAzJiLVv96VaROISAqqrqFFVVNUNVM4CYfXeK+dtHXvM6SPwDsVYlB1VNAIYEyAhYFHiOVSROIRYRzH1QIGaY91/AKhKHEsHGNHrtYZn9gO8g8UTiRz6fAFf3oFrEznzeIrGIiEgHK9/mjwy99qvoBMDK9vEJVpE4gnAR71cGEFUxpD/uvuZ1kHhgbYHbnDzByzcgqtrLgT5vibhTcgqqU8wllZeurWzQ520QRefw+ctO0xMAq+EmoG7Q529P7HSOIQUXuybA4n1t3ejzZoiqcw/ruxruPrZbeqfPGyBqDZcBIOzF7nVdsFqeNVwzRPFl8klMUXzR/lbXUeetENXn3pL5eynUNi0DQ9oaNvr87YldPi83VWrRlvahnj5vhtjytD0rA/YMD/C1f2N/3hgx90FF+lV0Wi4KLBcby/laOsh4vlUkDiF2Oi9xHLsA7427BQDqvCnCDklgFRkts38KEFXtjNzcr1JPT7z0dZD4m6Xf1mTD1lDnscperU1iO/c63C4qI1Ypw7hV4MOa060icSgRS1L3OO75XCzUm+PPt4rEEcTd7LX05z50B1Burm2xn7G9PcJ+ziDdrl23k1PjM60icSQxpBLb7cjrcvFxzLV/olUk/iPRlSeWtgFEBRA/RYebQBGT7QtruNaIeu7Vf7MSVEZ7AOT3rftJnGEViSMI4f9MkCBBggQJEiRIvB3xBRQQhRLK+n3NAAAAAElFTkSuQmCC','completed','2025-11-23 18:47:22.592499','2025-11-23 18:49:42.536115','2025-11-23 18:46:37.017780','2025-11-23 18:49:42.536115',1,NULL,4,9,27,NULL,NULL);
/*!40000 ALTER TABLE `game_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learning_objectives`
--

DROP TABLE IF EXISTS `learning_objectives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learning_objectives` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` longtext,
  `evaluation_criteria` longtext,
  `pedagogical_recommendations` longtext,
  `estimated_time` int DEFAULT NULL,
  `associated_resources` longtext,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `stage_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `learning_ob_stage_i_1b85ec_idx` (`stage_id`),
  KEY `learning_ob_is_acti_0b73ef_idx` (`is_active`),
  CONSTRAINT `learning_objectives_stage_id_9248a876_fk_stages_id` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_objectives`
--

LOCK TABLES `learning_objectives` WRITE;
/*!40000 ALTER TABLE `learning_objectives` DISABLE KEYS */;
/*!40000 ALTER TABLE `learning_objectives` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `minigames`
--

DROP TABLE IF EXISTS `minigames`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `minigames` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` varchar(20) NOT NULL,
  `config` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `minigames_is_acti_7fdda0_idx` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `minigames`
--

LOCK TABLES `minigames` WRITE;
/*!40000 ALTER TABLE `minigames` DISABLE KEYS */;
/*!40000 ALTER TABLE `minigames` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peer_evaluations`
--

DROP TABLE IF EXISTS `peer_evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peer_evaluations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `criteria_scores` json NOT NULL,
  `total_score` int NOT NULL,
  `tokens_awarded` int NOT NULL,
  `feedback` longtext,
  `submitted_at` datetime(6) NOT NULL,
  `game_session_id` bigint NOT NULL,
  `evaluated_team_id` bigint NOT NULL,
  `evaluator_team_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `peer_evaluations_evaluator_team_id_evalua_6adfd797_uniq` (`evaluator_team_id`,`evaluated_team_id`,`game_session_id`),
  KEY `peer_evalua_evaluat_41ec08_idx` (`evaluator_team_id`),
  KEY `peer_evalua_evaluat_813a7f_idx` (`evaluated_team_id`),
  KEY `peer_evalua_game_se_cf2369_idx` (`game_session_id`),
  CONSTRAINT `peer_evaluations_evaluated_team_id_c19f8124_fk_teams_id` FOREIGN KEY (`evaluated_team_id`) REFERENCES `teams` (`id`),
  CONSTRAINT `peer_evaluations_evaluator_team_id_248009cc_fk_teams_id` FOREIGN KEY (`evaluator_team_id`) REFERENCES `teams` (`id`),
  CONSTRAINT `peer_evaluations_game_session_id_fd7c8f42_fk_game_sessions_id` FOREIGN KEY (`game_session_id`) REFERENCES `game_sessions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peer_evaluations`
--

LOCK TABLES `peer_evaluations` WRITE;
/*!40000 ALTER TABLE `peer_evaluations` DISABLE KEYS */;
INSERT INTO `peer_evaluations` VALUES (271,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 17:41:48.809534',180,538,539),(272,'{\"clarity\": 1, \"solution\": 1, \"presentation\": 1}',3,3,'','2025-11-23 17:44:30.141263',180,538,540),(273,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 17:45:02.605968',180,539,538),(274,'{\"clarity\": 1, \"solution\": 1, \"presentation\": 1}',3,3,'','2025-11-23 17:45:05.120024',180,539,540),(275,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 17:45:27.998149',180,540,539),(276,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 17:45:35.368364',180,540,538),(277,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:05:53.853535',179,535,536),(278,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'hsjsusa','2025-11-23 18:05:57.858617',179,535,537),(279,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:06:18.981708',179,537,535),(280,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:06:23.606065',179,537,536),(281,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:06:34.816156',179,536,535),(282,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'hsjsusa','2025-11-23 18:06:46.878055',179,536,537),(283,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:22:24.766157',182,544,546),(284,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:22:32.608398',182,544,545),(285,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:22:45.321533',182,546,544),(286,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:22:47.667932',182,546,545),(287,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:22:58.169049',182,545,544),(288,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:23:00.554356',182,545,546),(289,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:28:39.315359',181,543,541),(290,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:28:53.665842',181,543,542),(291,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:29:03.926886',181,542,541),(292,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:29:09.336140',181,542,543),(293,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:29:24.801620',181,541,543),(294,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:29:27.575720',181,541,542),(295,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:38:54.578144',184,551,552),(296,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:38:57.518039',184,551,550),(297,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:39:06.526342',184,550,551),(298,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:39:09.023792',184,550,552),(299,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:39:22.774244',184,552,551),(300,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:39:25.012717',184,552,550),(301,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:45:39.570232',183,548,549),(302,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:45:43.740789',183,548,547),(303,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:48:57.344557',186,558,557),(304,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:49:01.760648',186,558,556),(305,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:49:11.769464',186,556,557),(306,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:49:16.504686',186,556,558),(307,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:49:28.746848',186,557,556),(308,'{\"clarity\": 5, \"solution\": 5, \"presentation\": 5}',15,15,'','2025-11-23 18:49:31.596515',186,557,558);
/*!40000 ALTER TABLE `peer_evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professors`
--

DROP TABLE IF EXISTS `professors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professors` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `access_code` varchar(20) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `access_code` (`access_code`),
  KEY `professors_user_id_88fbd9_idx` (`user_id`),
  KEY `professors_access__6616cd_idx` (`access_code`),
  CONSTRAINT `professors_user_id_5d848ad9_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professors`
--

LOCK TABLES `professors` WRITE;
/*!40000 ALTER TABLE `professors` DISABLE KEYS */;
INSERT INTO `professors` VALUES (1,'123456','2025-11-04 00:32:03.506000','2025-11-04 00:32:03.506000',2),(2,'123459','2025-11-04 18:11:17.643000','2025-11-04 18:11:17.643000',4),(3,'123450','2025-11-04 18:40:33.774000','2025-11-04 18:40:33.774000',5),(4,'122222','2025-11-05 17:06:47.825000','2025-11-05 17:06:47.825000',6),(5,'juan@udd.cl','2025-11-07 18:12:48.304273','2025-11-07 18:12:48.304273',7),(6,'7328773','2025-11-07 18:18:31.602914','2025-11-07 18:18:31.602914',8),(7,'123451','2025-11-19 12:13:00.616796','2025-11-19 12:13:00.616796',9),(8,'238293e','2025-11-20 01:41:02.427020','2025-11-20 01:41:02.427020',10),(9,'323323','2025-11-23 17:02:43.484058','2025-11-23 17:02:43.485058',11),(10,'362772','2025-11-23 17:22:37.836507','2025-11-23 17:22:37.836507',12);
/*!40000 ALTER TABLE `professors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reflection_evaluations`
--

DROP TABLE IF EXISTS `reflection_evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reflection_evaluations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_name` varchar(200) NOT NULL,
  `student_email` varchar(254) NOT NULL,
  `career` varchar(200) DEFAULT NULL,
  `value_areas` json NOT NULL,
  `satisfaction` varchar(50) DEFAULT NULL,
  `entrepreneurship_interest` varchar(50) DEFAULT NULL,
  `comments` longtext,
  `created_at` datetime(6) NOT NULL,
  `game_session_id` bigint NOT NULL,
  `faculty` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reflection__game_se_728398_idx` (`game_session_id`),
  KEY `reflection__student_836c1c_idx` (`student_email`),
  CONSTRAINT `reflection_evaluatio_game_session_id_22c4e282_fk_game_sess` FOREIGN KEY (`game_session_id`) REFERENCES `game_sessions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reflection_evaluations`
--

LOCK TABLES `reflection_evaluations` WRITE;
/*!40000 ALTER TABLE `reflection_evaluations` DISABLE KEYS */;
INSERT INTO `reflection_evaluations` VALUES (5,'udsus','jdsjsj@udd.cl','Ingeniería civil informática e innovación tecnológica','[\"Resolver desafios\", \"Trabajar en equipo\"]','mucho','ya_tenia',NULL,'2025-11-23 18:55:48.350319',185,'Ingeniería');
/*!40000 ALTER TABLE `reflection_evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roulette_challenges`
--

DROP TABLE IF EXISTS `roulette_challenges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roulette_challenges` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` longtext NOT NULL,
  `challenge_type` varchar(20) NOT NULL,
  `difficulty_estimated` int NOT NULL,
  `token_reward_min` int NOT NULL,
  `token_reward_max` int NOT NULL,
  `stages_applicable` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `roulette_ch_challen_ddbd15_idx` (`challenge_type`),
  KEY `roulette_ch_is_acti_977e2a_idx` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roulette_challenges`
--

LOCK TABLES `roulette_challenges` WRITE;
/*!40000 ALTER TABLE `roulette_challenges` DISABLE KEYS */;
/*!40000 ALTER TABLE `roulette_challenges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session_groups`
--

DROP TABLE IF EXISTS `session_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `total_students` int NOT NULL,
  `number_of_sessions` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `course_id` bigint NOT NULL,
  `professor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `session_gro_profess_20eb21_idx` (`professor_id`),
  KEY `session_gro_course__2145cd_idx` (`course_id`),
  CONSTRAINT `session_groups_course_id_b808e141_fk_courses_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `session_groups_professor_id_2d33326a_fk_professors_id` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_groups`
--

LOCK TABLES `session_groups` WRITE;
/*!40000 ALTER TABLE `session_groups` DISABLE KEYS */;
INSERT INTO `session_groups` VALUES (1,46,2,'2025-11-14 12:11:01.214416','2025-11-14 12:11:01.214416',1,6),(2,46,2,'2025-11-14 12:16:05.498888','2025-11-14 12:16:05.498888',1,6),(3,46,2,'2025-11-14 13:22:18.852562','2025-11-14 13:22:18.852562',1,6),(4,46,2,'2025-11-14 17:54:45.238948','2025-11-14 17:54:45.238948',1,6),(5,46,2,'2025-11-15 18:11:49.027125','2025-11-15 18:11:49.027125',1,6),(6,46,2,'2025-11-16 03:45:21.216572','2025-11-16 03:45:21.216572',1,6),(7,46,2,'2025-11-16 17:35:53.815745','2025-11-16 17:35:53.815745',1,6),(8,46,2,'2025-11-16 17:51:01.646307','2025-11-16 17:51:01.646307',1,6),(9,46,2,'2025-11-16 18:11:59.879231','2025-11-16 18:11:59.879231',1,6),(10,46,2,'2025-11-16 18:37:39.887000','2025-11-16 18:37:39.887000',1,6),(11,46,2,'2025-11-16 19:10:13.510166','2025-11-16 19:10:13.510166',1,6),(12,46,2,'2025-11-16 19:47:47.223205','2025-11-16 19:47:47.223205',1,6),(13,46,2,'2025-11-17 08:08:55.428608','2025-11-17 08:08:55.428608',1,6),(14,46,2,'2025-11-17 12:56:19.862290','2025-11-17 12:56:19.862290',1,6),(15,46,2,'2025-11-17 12:57:22.531124','2025-11-17 12:57:22.531124',1,6),(16,46,2,'2025-11-18 03:05:46.361681','2025-11-18 03:05:46.361681',1,6),(17,46,2,'2025-11-18 05:13:28.162104','2025-11-18 05:13:28.162104',1,6),(18,46,2,'2025-11-19 12:24:10.145097','2025-11-19 12:24:10.145097',1,7),(19,46,2,'2025-11-19 13:13:33.373062','2025-11-19 13:13:33.373062',1,7),(20,46,2,'2025-11-19 14:00:13.605856','2025-11-19 14:00:13.605856',1,6),(21,46,2,'2025-11-19 14:52:45.238098','2025-11-19 14:52:45.238098',1,6),(22,46,2,'2025-11-20 16:17:22.839990','2025-11-20 16:17:22.839990',1,8),(23,46,2,'2025-11-20 19:15:49.375722','2025-11-20 19:15:49.375722',1,6),(24,46,2,'2025-11-23 17:24:38.825073','2025-11-23 17:24:38.825073',1,9),(25,46,2,'2025-11-23 18:18:24.990797','2025-11-23 18:18:24.990797',1,9),(26,46,2,'2025-11-23 18:37:05.454657','2025-11-23 18:37:05.454657',1,9),(27,46,2,'2025-11-23 18:46:36.892074','2025-11-23 18:46:36.892074',1,9);
/*!40000 ALTER TABLE `session_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session_stages`
--

DROP TABLE IF EXISTS `session_stages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session_stages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `status` varchar(20) NOT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `game_session_id` bigint NOT NULL,
  `stage_id` bigint NOT NULL,
  `current_presentation_team_id` int DEFAULT NULL,
  `presentation_order` json DEFAULT NULL,
  `presentation_state` varchar(20) NOT NULL,
  `presentation_timestamps` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_stages_game_session_id_stage_id_36ac96ff_uniq` (`game_session_id`,`stage_id`),
  KEY `session_sta_game_se_80d31a_idx` (`game_session_id`),
  KEY `session_sta_stage_i_9da390_idx` (`stage_id`),
  KEY `session_sta_status_9dc993_idx` (`status`),
  CONSTRAINT `session_stages_game_session_id_fd63e682_fk_game_sessions_id` FOREIGN KEY (`game_session_id`) REFERENCES `game_sessions` (`id`),
  CONSTRAINT `session_stages_stage_id_61fec690_fk_stages_id` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=408 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_stages`
--

LOCK TABLES `session_stages` WRITE;
/*!40000 ALTER TABLE `session_stages` DISABLE KEYS */;
INSERT INTO `session_stages` VALUES (372,'completed','2025-11-23 17:03:59.393710','2025-11-23 17:06:34.031668',178,1,NULL,NULL,'not_started',NULL),(373,'completed','2025-11-23 17:06:42.441158','2025-11-23 17:10:00.238065',178,2,NULL,NULL,'not_started',NULL),(374,'completed','2025-11-23 17:10:12.584681','2025-11-23 17:11:38.166918',178,3,NULL,NULL,'not_started',NULL),(375,'in_progress','2025-11-23 17:12:38.085369',NULL,178,4,533,'[533, 534, 532]','presenting','{\"533\": \"2025-11-23T17:14:06.753976+00:00\"}'),(376,'completed','2025-11-23 17:31:45.952978','2025-11-23 17:33:48.303031',180,1,NULL,NULL,'not_started',NULL),(377,'completed','2025-11-23 17:33:55.377238','2025-11-23 17:39:00.589995',180,2,NULL,NULL,'not_started',NULL),(378,'completed','2025-11-23 17:39:10.018043','2025-11-23 17:40:09.750938',180,3,NULL,NULL,'not_started',NULL),(379,'completed','2025-11-23 17:40:17.104296','2025-11-23 17:45:38.961578',180,4,540,'[538, 539, 540]','evaluating','{\"538\": \"2025-11-23T17:41:31.249715+00:00\", \"539\": \"2025-11-23T17:44:44.875122+00:00\", \"540\": \"2025-11-23T17:45:09.329289+00:00\", \"_reflection\": true, \"_reflection_started_at\": \"2025-11-23T17:45:50.872101+00:00\"}'),(380,'completed','2025-11-23 17:54:53.482880','2025-11-23 18:03:49.542039',179,1,NULL,NULL,'not_started',NULL),(381,'completed','2025-11-23 18:04:01.414472','2025-11-23 18:04:10.506880',179,2,NULL,NULL,'not_started',NULL),(382,'completed','2025-11-23 18:04:14.249439','2025-11-23 18:04:19.364350',179,3,NULL,NULL,'not_started',NULL),(383,'completed','2025-11-23 18:04:21.970008','2025-11-23 18:08:12.776817',179,4,536,'[535, 537, 536]','evaluating','{\"535\": \"2025-11-23T18:05:32.471390+00:00\", \"536\": \"2025-11-23T18:06:29.324166+00:00\", \"537\": \"2025-11-23T18:06:09.480409+00:00\", \"_reflection\": true, \"_reflection_started_at\": \"2025-11-23T18:06:49.890205+00:00\"}'),(384,'completed','2025-11-23 18:19:20.310552','2025-11-23 18:19:30.190668',182,1,NULL,NULL,'not_started',NULL),(385,'completed','2025-11-23 18:19:35.838095','2025-11-23 18:19:47.426515',182,2,NULL,NULL,'not_started',NULL),(386,'completed','2025-11-23 18:19:52.324532','2025-11-23 18:21:56.560498',182,3,NULL,NULL,'not_started',NULL),(387,'completed','2025-11-23 18:22:06.450627','2025-11-23 18:23:03.656028',182,4,545,'[544, 546, 545]','evaluating','{\"544\": \"2025-11-23T18:22:18.636046+00:00\", \"545\": \"2025-11-23T18:22:51.427760+00:00\", \"546\": \"2025-11-23T18:22:38.997700+00:00\"}'),(388,'completed','2025-11-23 18:26:49.610452','2025-11-23 18:27:06.519275',181,1,NULL,NULL,'not_started',NULL),(389,'completed','2025-11-23 18:27:11.967232','2025-11-23 18:27:21.571636',181,2,NULL,NULL,'not_started',NULL),(390,'completed','2025-11-23 18:27:25.559934','2025-11-23 18:27:31.579575',181,3,NULL,NULL,'not_started',NULL),(391,'completed','2025-11-23 18:27:34.075229','2025-11-23 18:29:31.824203',181,4,541,'[543, 542, 541]','evaluating','{\"541\": \"2025-11-23T18:29:14.022264+00:00\", \"542\": \"2025-11-23T18:28:58.561046+00:00\", \"543\": \"2025-11-23T18:27:44.856730+00:00\", \"_reflection\": true, \"_reflection_started_at\": \"2025-11-23T18:33:46.052482+00:00\"}'),(392,'completed','2025-11-23 18:37:56.624020','2025-11-23 18:38:07.375466',184,1,NULL,NULL,'not_started',NULL),(393,'completed','2025-11-23 18:38:13.145087','2025-11-23 18:38:22.479826',184,2,NULL,NULL,'not_started',NULL),(394,'completed','2025-11-23 18:38:26.434662','2025-11-23 18:38:34.616792',184,3,NULL,NULL,'not_started',NULL),(395,'completed','2025-11-23 18:38:37.476534','2025-11-23 18:39:27.276987',184,4,552,'[551, 550, 552]','evaluating','{\"550\": \"2025-11-23T18:39:01.396184+00:00\", \"551\": \"2025-11-23T18:38:45.387054+00:00\", \"552\": \"2025-11-23T18:39:13.984037+00:00\", \"_reflection\": true, \"_reflection_started_at\": \"2025-11-23T18:42:02.130957+00:00\"}'),(396,'completed','2025-11-23 18:43:39.132520','2025-11-23 18:43:47.658185',183,1,NULL,NULL,'not_started',NULL),(397,'completed','2025-11-23 18:43:53.520918','2025-11-23 18:44:04.277596',183,2,NULL,NULL,'not_started',NULL),(398,'completed','2025-11-23 18:44:09.081777','2025-11-23 18:44:14.956912',183,3,NULL,NULL,'not_started',NULL),(399,'completed','2025-11-23 18:45:04.287110','2025-11-23 18:45:50.737169',183,4,548,'[547, 549, 548]','evaluating','{\"547\": \"2025-11-23T18:45:12.389056+00:00\", \"548\": \"2025-11-23T18:45:20.321224+00:00\", \"549\": \"2025-11-23T18:45:15.836114+00:00\", \"_reflection\": true, \"_reflection_started_at\": \"2025-11-23T18:46:02.462718+00:00\"}'),(400,'completed','2025-11-23 18:47:26.691664','2025-11-23 18:47:36.509560',186,1,NULL,NULL,'not_started',NULL),(401,'completed','2025-11-23 18:47:43.874964','2025-11-23 18:47:55.465340',186,2,NULL,NULL,'not_started',NULL),(402,'completed','2025-11-23 18:48:00.894971','2025-11-23 18:48:07.124656',186,3,NULL,NULL,'not_started',NULL),(403,'completed','2025-11-23 18:48:09.914042','2025-11-23 18:49:34.726249',186,4,557,'[558, 556, 557]','evaluating','{\"556\": \"2025-11-23T18:49:06.051333+00:00\", \"557\": \"2025-11-23T18:49:21.377666+00:00\", \"558\": \"2025-11-23T18:48:47.040365+00:00\", \"_reflection\": true, \"_reflection_started_at\": \"2025-11-23T18:49:42.530558+00:00\"}'),(404,'completed','2025-11-23 18:52:47.115645','2025-11-23 18:52:55.131110',185,1,NULL,NULL,'not_started',NULL),(405,'completed','2025-11-23 18:52:59.497536','2025-11-23 18:53:08.233763',185,2,NULL,NULL,'not_started',NULL),(406,'completed','2025-11-23 18:53:12.600242','2025-11-23 18:53:17.658039',185,3,NULL,NULL,'not_started',NULL),(407,'completed','2025-11-23 18:53:21.130364','2025-11-23 18:54:16.108888',185,4,553,'[555, 554, 553]','evaluating','{\"553\": \"2025-11-23T18:53:38.294104+00:00\", \"554\": \"2025-11-23T18:53:34.532470+00:00\", \"555\": \"2025-11-23T18:53:30.610931+00:00\", \"_reflection\": true, \"_reflection_started_at\": \"2025-11-23T18:54:26.606871+00:00\"}');
/*!40000 ALTER TABLE `session_stages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stages`
--

DROP TABLE IF EXISTS `stages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `number` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` longtext,
  `objective` longtext,
  `estimated_duration` int DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `number` (`number`),
  KEY `stages_number_09a69d_idx` (`number`),
  KEY `stages_is_acti_aa6986_idx` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stages`
--

LOCK TABLES `stages` WRITE;
/*!40000 ALTER TABLE `stages` DISABLE KEYS */;
INSERT INTO `stages` VALUES (1,1,'Trabajo en Equipo','Primera etapa del juego enfocada en trabajo colaborativo','Fomentar el trabajo en equipo y la colaboración',60,1,'2025-11-04 03:58:18.791000','2025-11-04 16:03:58.080000'),(2,2,'EmpatÃ­a','Conocer problemas y abordar un caso o desafÃ­o',NULL,30,1,'2025-11-04 23:18:44.809000','2025-11-04 23:18:44.809000'),(3,3,'Creatividad','Tercera etapa del juego enfocada en la creatividad y construcción de prototipos','Crear una solución con legos',30,1,'2025-11-05 02:28:51.625000','2025-11-05 02:28:51.625000'),(4,4,'Comunicación','Cuarta etapa del juego enfocada en la comunicación y presentación del pitch','Crear y comunicar pitch',45,1,'2025-11-05 05:28:59.097000','2025-11-05 05:28:59.097000');
/*!40000 ALTER TABLE `stages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(200) NOT NULL,
  `email` varchar(254) NOT NULL,
  `rut` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `rut` (`rut`),
  KEY `students_email_b942ac_idx` (`email`),
  KEY `students_rut_b476d2_idx` (`rut`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'JESUS ALEJANDRO AZUAJE PEREZ','j.azuajep@udd.cl','26083316','2025-11-04 01:17:19.056000','2025-11-04 01:17:19.056000'),(2,'LEANDRO AÑASCO TELLERI','lanascot@udd.cl','21793579','2025-11-04 01:17:19.073000','2025-11-04 01:17:19.073000'),(3,'RAIMUNDO BARBOSA PETIT','r.barbosap@udd.cl','21552660','2025-11-04 01:17:19.085000','2025-11-04 01:17:19.085000'),(4,'ALEJANDRO PATRICIO BARRIENTOS VILLALOBOS','a.barrientosv@udd.cl','21594003','2025-11-04 01:17:19.093000','2025-11-04 01:17:19.093000'),(5,'BASTIÁN IGNACIO FARIÑA LARA','b.farinal@udd.cl','21756083','2025-11-04 01:17:19.106000','2025-11-04 01:17:19.106000'),(6,'MARTÍN ISAIAS GUERRERO ANCAPICHÚN','m.guerreroa@udd.cl','21605843','2025-11-04 01:17:19.106000','2025-11-04 01:17:19.106000'),(7,'MARTÍN ALEJANDRO OLIVARES ROJAS','m.olivaresr@udd.cl','21644638','2025-11-04 01:17:19.123000','2025-11-04 01:17:19.123000'),(8,'SANTIAGO ANDRÉS PAGE MUNITA','spagem@udd.cl','21612007','2025-11-04 01:17:19.132000','2025-11-04 01:17:19.132000'),(9,'SEBASTIÁN RAMORINO CARRILLO','sramorinoc@udd.cl','21782154','2025-11-04 01:17:19.132000','2025-11-04 01:17:19.132000'),(10,'AGUSTÍN EDUARDO REYES PEREIRA','a.reyesp@udd.cl','21150243','2025-11-04 01:17:19.148000','2025-11-04 01:17:19.148000'),(11,'LUCAS JEREMÍAS RIQUELME TORRES','l.riquelmet@udd.cl','21303074','2025-11-04 01:17:19.156000','2025-11-04 01:17:19.156000'),(12,'DANIEL ANDRÉS ROMERO BELTRÁN','d.romerob@udd.cl','21439688','2025-11-04 01:17:19.164000','2025-11-04 01:17:19.164000'),(13,'SEBASTIAN FERNANDO RUIZ RIFFO','s.ruizr@udd.cl','21675942','2025-11-04 01:17:19.174000','2025-11-04 01:17:19.176000'),(14,'JOSE IGNACIO SAAVEDRA HANS','jsaavedrah@udd.cl','21551254','2025-11-04 01:17:19.182000','2025-11-04 01:17:19.182000'),(15,'ÁLVARO FRANCISCO TORRES FERNÁNDEZ','a.torresf@udd.cl','21740840','2025-11-04 01:17:19.182000','2025-11-04 01:17:19.182000'),(16,'RENATO IGNACIO VARELA ROJAS','r.varelar@udd.cl','21765535','2025-11-04 01:17:19.196000','2025-11-04 01:17:19.196000'),(17,'MATÍAS ALEJANDRO VERGARA FLORES','matvergaraf@udd.cl','20914842','2025-11-04 01:17:19.196000','2025-11-04 01:17:19.196000'),(18,'Paz Vásquez Vera','paz.vásquez0@mail.udd.cl','20000000-8','2025-11-14 12:10:53.798679','2025-11-14 12:10:53.798679'),(19,'Trinidad Cortés Muñoz','trinidad.cortés1@mail.udd.cl','20000001-5','2025-11-14 12:10:53.828234','2025-11-14 12:10:53.828234'),(20,'Lucas Contreras Vargas','lucas.contreras2@mail.udd.cl','20000002-6','2025-11-14 12:10:53.847319','2025-11-14 12:10:53.847319'),(21,'Trinidad López Herrera','trinidad.lópez3@mail.udd.cl','20000003-9','2025-11-14 12:10:53.867788','2025-11-14 12:10:53.867788'),(22,'Nicolás Vidal Ruiz','nicolás.vidal4@mail.udd.cl','20000004-8','2025-11-14 12:10:53.890548','2025-11-14 12:10:53.890548'),(23,'Camila Vásquez Contreras','camila.vásquez5@mail.udd.cl','20000005-7','2025-11-14 12:10:53.906983','2025-11-14 12:10:53.906983'),(24,'Magdalena Herrera Vera','magdalena.herrera6@mail.udd.cl','20000006-4','2025-11-14 12:10:53.920972','2025-11-14 12:10:53.920972'),(25,'Felipe Sepúlveda Torres','felipe.sepúlveda7@mail.udd.cl','20000007-8','2025-11-14 12:10:53.954666','2025-11-14 12:10:53.954666'),(26,'Carlos Fernández Silva','carlos.fernández8@mail.udd.cl','20000008-4','2025-11-14 12:10:53.999264','2025-11-14 12:10:53.999264'),(27,'Dominga Pizarro Pérez','dominga.pizarro9@mail.udd.cl','20000009-7','2025-11-14 12:10:54.015899','2025-11-14 12:10:54.015899'),(28,'Francisco Martínez Fernández','francisco.martínez10@mail.udd.cl','20000010-6','2025-11-14 12:10:54.032893','2025-11-14 12:10:54.032893'),(29,'Sebastián Hernández Pérez','sebastián.hernández11@mail.udd.cl','20000011-7','2025-11-14 12:10:54.048075','2025-11-14 12:10:54.048075'),(30,'Diego Muñoz Muñoz','diego.muñoz12@mail.udd.cl','20000012-4','2025-11-14 12:10:54.079229','2025-11-14 12:10:54.079229'),(31,'Fernando Gutiérrez Vega','fernando.gutiérrez13@mail.udd.cl','20000013-9','2025-11-14 12:10:54.098408','2025-11-14 12:10:54.099407'),(32,'Francisca Reyes Martínez','francisca.reyes14@mail.udd.cl','20000014-9','2025-11-14 12:10:54.117601','2025-11-14 12:10:54.117601'),(33,'Matías Herrera Ortiz','matías.herrera15@mail.udd.cl','20000015-4','2025-11-14 12:10:54.139008','2025-11-14 12:10:54.139008'),(34,'Ricardo Herrera Romero','ricardo.herrera16@mail.udd.cl','20000016-9','2025-11-14 12:10:54.157162','2025-11-14 12:10:54.158160'),(35,'Ignacio Espinoza Herrera','ignacio.espinoza17@mail.udd.cl','20000017-6','2025-11-14 12:10:54.176313','2025-11-14 12:10:54.176313'),(36,'Sebastián Díaz Fernández','sebastián.díaz18@mail.udd.cl','20000018-2','2025-11-14 12:10:54.194578','2025-11-14 12:10:54.194578'),(37,'Rafaela Mendoza Contreras','rafaela.mendoza19@mail.udd.cl','20000019-7','2025-11-14 12:10:54.213855','2025-11-14 12:10:54.213855'),(38,'Tomás Tapia Pérez','tomás.tapia20@mail.udd.cl','20000020-3','2025-11-14 12:10:54.232165','2025-11-14 12:10:54.232165'),(39,'Constanza Guerrero Sánchez','constanza.guerrero21@mail.udd.cl','20000021-6','2025-11-14 12:10:54.249741','2025-11-14 12:10:54.249741'),(40,'Emilia Moreno Díaz','emilia.moreno22@mail.udd.cl','20000022-1','2025-11-14 12:10:54.266976','2025-11-14 12:10:54.266976'),(41,'Ana Fuentes Herrera','ana.fuentes23@mail.udd.cl','20000023-9','2025-11-14 12:10:54.285157','2025-11-14 12:10:54.285157'),(42,'Martina Soto Medina','martina.soto24@mail.udd.cl','20000024-1','2025-11-14 12:10:54.302532','2025-11-14 12:10:54.302532'),(43,'Martina Ramos Muñoz','martina.ramos25@mail.udd.cl','20000025-1','2025-11-14 12:10:54.320116','2025-11-14 12:10:54.320116'),(44,'Paz Ramírez Chávez','paz.ramírez26@mail.udd.cl','20000026-8','2025-11-14 12:10:54.337506','2025-11-14 12:10:54.337506'),(45,'Cristóbal Pérez Navarro','cristóbal.pérez27@mail.udd.cl','20000027-4','2025-11-14 12:10:54.370589','2025-11-14 12:10:54.370589'),(46,'Tomás Muñoz Pizarro','tomás.muñoz28@mail.udd.cl','20000028-7','2025-11-14 12:10:54.388636','2025-11-14 12:10:54.388636'),(47,'Cristóbal Gutiérrez Fuentes','cristóbal.gutiérrez29@mail.udd.cl','20000029-2','2025-11-14 12:10:54.407359','2025-11-14 12:10:54.407359'),(48,'Trinidad Contreras Castro','trinidad.contreras30@mail.udd.cl','20000030-1','2025-11-14 12:10:54.426703','2025-11-14 12:10:54.426703'),(49,'Isabella González Martínez','isabella.gonzález31@mail.udd.cl','20000031-6','2025-11-14 12:10:54.445360','2025-11-14 12:10:54.445360'),(50,'Valentina Díaz Gutiérrez','valentina.díaz32@mail.udd.cl','20000032-1','2025-11-14 12:10:54.462522','2025-11-14 12:10:54.462522'),(51,'Francisca Araya Morales','francisca.araya33@mail.udd.cl','20000033-6','2025-11-14 12:10:54.497021','2025-11-14 12:10:54.497021'),(52,'Antonia Fernández Pérez','antonia.fernández34@mail.udd.cl','20000034-3','2025-11-14 12:10:54.512863','2025-11-14 12:10:54.512863'),(53,'Rosario Silva Araya','rosario.silva35@mail.udd.cl','20000035-3','2025-11-14 12:10:54.528800','2025-11-14 12:10:54.529806'),(54,'Vicente Contreras Fernández','vicente.contreras36@mail.udd.cl','20000036-6','2025-11-14 12:10:54.540797','2025-11-14 12:10:54.540797'),(55,'Diego Herrera Morales','diego.herrera37@mail.udd.cl','20000037-1','2025-11-14 12:10:54.556707','2025-11-14 12:10:54.556707'),(56,'Agustina López Pérez','agustina.lópez38@mail.udd.cl','20000038-8','2025-11-14 12:10:54.572080','2025-11-14 12:10:54.572080'),(57,'Antonia Gutiérrez Vera','antonia.gutiérrez39@mail.udd.cl','20000039-3','2025-11-14 12:10:54.586379','2025-11-14 12:10:54.586379'),(58,'Antonia Peña Muñoz','antonia.peña40@mail.udd.cl','20000040-4','2025-11-14 12:10:54.601810','2025-11-14 12:10:54.601810'),(59,'Emilia Soto Vera','emilia.soto41@mail.udd.cl','20000041-3','2025-11-14 12:10:54.617556','2025-11-14 12:10:54.617556'),(60,'Matías Reyes Soto','matías.reyes42@mail.udd.cl','20000042-5','2025-11-14 12:10:54.631621','2025-11-14 12:10:54.631621'),(61,'Ignacio Sánchez Castro','ignacio.sánchez43@mail.udd.cl','20000043-1','2025-11-14 12:10:54.849143','2025-11-14 12:10:54.849143'),(62,'Ricardo Torres Ramírez','ricardo.torres44@mail.udd.cl','20000044-1','2025-11-14 12:10:54.944661','2025-11-14 12:10:54.944661'),(63,'Laura Hernández Ruiz','laura.hernández45@mail.udd.cl','20000045-5','2025-11-14 12:10:55.037955','2025-11-14 12:10:55.037955');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tablet_connections`
--

DROP TABLE IF EXISTS `tablet_connections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tablet_connections` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `connected_at` datetime(6) NOT NULL,
  `disconnected_at` datetime(6) DEFAULT NULL,
  `last_seen` datetime(6) NOT NULL,
  `game_session_id` bigint NOT NULL,
  `tablet_id` bigint NOT NULL,
  `team_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tablet_conn_tablet__aebeaa_idx` (`tablet_id`),
  KEY `tablet_conn_team_id_842e97_idx` (`team_id`),
  KEY `tablet_conn_game_se_380fa9_idx` (`game_session_id`),
  KEY `tablet_conn_last_se_be9684_idx` (`last_seen`),
  CONSTRAINT `tablet_connections_game_session_id_91f1926c_fk_game_sessions_id` FOREIGN KEY (`game_session_id`) REFERENCES `game_sessions` (`id`),
  CONSTRAINT `tablet_connections_tablet_id_7ddc0d0f_fk_tablets_id` FOREIGN KEY (`tablet_id`) REFERENCES `tablets` (`id`),
  CONSTRAINT `tablet_connections_team_id_dffc7a3d_fk_teams_id` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=496 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tablet_connections`
--

LOCK TABLES `tablet_connections` WRITE;
/*!40000 ALTER TABLE `tablet_connections` DISABLE KEYS */;
INSERT INTO `tablet_connections` VALUES (469,'2025-11-23 17:03:40.615915','2025-11-23 17:23:41.571712','2025-11-23 17:23:41.577710',178,1,533),(470,'2025-11-23 17:03:45.299899','2025-11-23 17:23:41.571712','2025-11-23 17:23:41.599354',178,2,534),(471,'2025-11-23 17:03:50.447473','2025-11-23 17:23:41.571712','2025-11-23 17:23:41.615331',178,3,532),(472,'2025-11-23 17:27:32.775649',NULL,'2025-11-23 17:27:32.775649',180,1,539),(473,'2025-11-23 17:29:51.402058',NULL,'2025-11-23 17:29:51.402058',180,2,540),(474,'2025-11-23 17:31:23.602872',NULL,'2025-11-23 17:31:23.602872',180,3,538),(475,'2025-11-23 17:54:19.354769',NULL,'2025-11-23 17:54:19.354769',179,1,536),(476,'2025-11-23 17:54:32.005297',NULL,'2025-11-23 17:54:32.005297',179,2,537),(477,'2025-11-23 17:54:45.231774',NULL,'2025-11-23 17:54:45.231774',179,3,535),(478,'2025-11-23 18:19:03.516038',NULL,'2025-11-23 18:19:03.516038',182,3,545),(479,'2025-11-23 18:19:08.297333',NULL,'2025-11-23 18:19:08.297333',182,1,546),(480,'2025-11-23 18:19:13.256189',NULL,'2025-11-23 18:19:13.256189',182,2,544),(481,'2025-11-23 18:26:12.874971',NULL,'2025-11-23 18:26:12.874971',181,3,542),(482,'2025-11-23 18:26:20.210705',NULL,'2025-11-23 18:26:20.210705',181,2,543),(483,'2025-11-23 18:26:26.971700',NULL,'2025-11-23 18:26:26.971700',181,1,541),(484,'2025-11-23 18:37:28.776817',NULL,'2025-11-23 18:37:28.776817',184,3,551),(485,'2025-11-23 18:37:37.426526',NULL,'2025-11-23 18:37:37.426526',184,1,552),(486,'2025-11-23 18:37:50.655258',NULL,'2025-11-23 18:37:50.655258',184,2,550),(487,'2025-11-23 18:42:42.116778',NULL,'2025-11-23 18:42:42.116778',183,3,548),(488,'2025-11-23 18:43:16.570245',NULL,'2025-11-23 18:43:16.570245',183,2,549),(489,'2025-11-23 18:43:26.719026',NULL,'2025-11-23 18:43:26.719026',183,1,547),(490,'2025-11-23 18:46:51.084483',NULL,'2025-11-23 18:46:51.084483',186,1,557),(491,'2025-11-23 18:47:10.035480',NULL,'2025-11-23 18:47:10.035480',186,2,558),(492,'2025-11-23 18:47:16.974246',NULL,'2025-11-23 18:47:16.974246',186,3,556),(493,'2025-11-23 18:52:11.563476',NULL,'2025-11-23 18:52:11.563476',185,1,554),(494,'2025-11-23 18:52:21.269445',NULL,'2025-11-23 18:52:21.269445',185,2,555),(495,'2025-11-23 18:52:34.411090',NULL,'2025-11-23 18:52:34.411090',185,3,553);
/*!40000 ALTER TABLE `tablet_connections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tablets`
--

DROP TABLE IF EXISTS `tablets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tablets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tablet_code` varchar(50) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tablet_code` (`tablet_code`),
  KEY `tablets_tablet__9cb635_idx` (`tablet_code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tablets`
--

LOCK TABLES `tablets` WRITE;
/*!40000 ALTER TABLE `tablets` DISABLE KEYS */;
INSERT INTO `tablets` VALUES (1,'TAB1',1,'2025-11-04 01:45:10.245000','2025-11-04 01:45:36.080000'),(2,'TAB2',1,'2025-11-04 01:45:36.094000','2025-11-04 01:45:36.094000'),(3,'TAB3',1,'2025-11-04 01:45:36.102000','2025-11-04 01:45:36.102000'),(4,'TAB4',1,'2025-11-04 01:45:36.109000','2025-11-04 01:45:36.109000'),(5,'TAB5',1,'2025-11-04 01:45:36.117000','2025-11-04 01:45:36.117000'),(6,'TAB6',1,'2025-11-04 01:45:36.124000','2025-11-04 01:45:36.124000'),(7,'TAB7',1,'2025-11-04 01:45:36.132000','2025-11-04 01:45:36.132000'),(8,'TAB8',1,'2025-11-04 01:45:36.138000','2025-11-04 01:45:36.138000');
/*!40000 ALTER TABLE `tablets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_activity_progress`
--

DROP TABLE IF EXISTS `team_activity_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_activity_progress` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `status` varchar(20) NOT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `progress_percentage` int NOT NULL,
  `response_data` json DEFAULT NULL,
  `prototype_image_url` varchar(500) DEFAULT NULL,
  `pitch_intro_problem` longtext,
  `pitch_solution` longtext,
  `pitch_closing` longtext,
  `activity_id` bigint NOT NULL,
  `selected_challenge_id` bigint DEFAULT NULL,
  `selected_topic_id` bigint DEFAULT NULL,
  `session_stage_id` bigint NOT NULL,
  `team_id` bigint NOT NULL,
  `pitch_value` longtext,
  `pitch_impact` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team_activity_progress_team_id_activity_id_sess_b25a7a5c_uniq` (`team_id`,`activity_id`,`session_stage_id`),
  KEY `team_activi_team_id_2c8afb_idx` (`team_id`),
  KEY `team_activi_session_0d2b15_idx` (`session_stage_id`),
  KEY `team_activi_activit_e95388_idx` (`activity_id`),
  KEY `team_activi_status_00750a_idx` (`status`),
  KEY `team_activi_team_id_d1bada_idx` (`team_id`,`activity_id`),
  KEY `team_activi_session_1a4ca1_idx` (`session_stage_id`,`activity_id`),
  KEY `team_activity_progre_selected_challenge_i_b972b61d_fk_challenge` (`selected_challenge_id`),
  KEY `team_activity_progress_selected_topic_id_6bb5e15b_fk_topics_id` (`selected_topic_id`),
  CONSTRAINT `team_activity_progre_selected_challenge_i_b972b61d_fk_challenge` FOREIGN KEY (`selected_challenge_id`) REFERENCES `challenges` (`id`),
  CONSTRAINT `team_activity_progre_session_stage_id_b07378b9_fk_session_s` FOREIGN KEY (`session_stage_id`) REFERENCES `session_stages` (`id`),
  CONSTRAINT `team_activity_progress_activity_id_8a7df130_fk_activities_id` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`),
  CONSTRAINT `team_activity_progress_selected_topic_id_6bb5e15b_fk_topics_id` FOREIGN KEY (`selected_topic_id`) REFERENCES `topics` (`id`),
  CONSTRAINT `team_activity_progress_team_id_692cd6e6_fk_teams_id` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2277 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_activity_progress`
--

LOCK TABLES `team_activity_progress` WRITE;
/*!40000 ALTER TABLE `team_activity_progress` DISABLE KEYS */;
INSERT INTO `team_activity_progress` VALUES (2088,'completed','2025-11-23 17:03:59.393710','2025-11-23 17:05:18.832488',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,372,533,NULL,NULL),(2089,'completed','2025-11-23 17:03:59.393710','2025-11-23 17:05:18.870146',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,372,534,NULL,NULL),(2090,'completed','2025-11-23 17:03:59.393710','2025-11-23 17:05:18.929161',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,372,532,NULL,NULL),(2091,'completed','2025-11-23 17:05:19.004757','2025-11-23 17:05:33.280292',100,'{\"type\": \"presentation\", \"completed\": true}',NULL,NULL,NULL,NULL,2,NULL,NULL,372,533,NULL,NULL),(2092,'completed','2025-11-23 17:05:19.004757','2025-11-23 17:06:14.940004',100,'{\"answers\": [{\"word\": \"EMPRENDER\", \"answer\": \"EMPRENDER\"}, {\"word\": \"INNOVACION\", \"answer\": \"INNOVACION\"}, {\"word\": \"CREATIVIDAD\", \"answer\": \"CREATIVIDAD\"}], \"found_words\": [\"META\", \"IDEA\", \"PITCH\", \"LIDER\", \"EQUIPO\"], \"total_words\": 5, \"minigame_part\": \"anagram\", \"minigame_type\": \"anagrama\", \"tokens_earned\": 8, \"correct_answers\": 3, \"anagram_total_words\": 3, \"anagram_words_found\": 3, \"word_search_total_words\": 5, \"word_search_words_found\": 5}',NULL,NULL,NULL,NULL,2,NULL,NULL,372,534,NULL,NULL),(2093,'completed','2025-11-23 17:05:19.004757','2025-11-23 17:06:25.696725',100,'{\"type\": \"presentation\", \"completed\": true}',NULL,NULL,NULL,NULL,2,NULL,NULL,372,532,NULL,NULL),(2094,'completed','2025-11-23 17:06:42.491284','2025-11-23 17:07:12.808722',100,NULL,NULL,NULL,NULL,NULL,3,1,1,373,533,NULL,NULL),(2095,'completed','2025-11-23 17:06:42.571539','2025-11-23 17:07:47.748071',100,NULL,NULL,NULL,NULL,NULL,3,5,2,373,534,NULL,NULL),(2096,'completed','2025-11-23 17:06:42.664496','2025-11-23 17:07:52.806891',100,NULL,NULL,NULL,NULL,NULL,3,7,3,373,532,NULL,NULL),(2097,'completed','2025-11-23 17:08:01.395731','2025-11-23 17:10:00.087816',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,373,533,NULL,NULL),(2098,'completed','2025-11-23 17:08:01.395731','2025-11-23 17:10:00.153831',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,373,534,NULL,NULL),(2099,'completed','2025-11-23 17:08:01.395731','2025-11-23 17:10:00.208031',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,373,532,NULL,NULL),(2100,'completed','2025-11-23 17:10:12.672065','2025-11-23 17:11:22.873577',100,NULL,'/media/prototypes/533_374_b0dba7ae.jpg',NULL,NULL,NULL,6,NULL,NULL,374,533,NULL,NULL),(2101,'completed','2025-11-23 17:10:12.771587','2025-11-23 17:11:14.939277',100,NULL,'/media/prototypes/534_374_e2098c8b.jpg',NULL,NULL,NULL,6,NULL,NULL,374,534,NULL,NULL),(2102,'completed','2025-11-23 17:10:12.823442','2025-11-23 17:11:03.858316',100,NULL,'/media/prototypes/532_374_0689ec4e.jpg',NULL,NULL,NULL,6,NULL,NULL,374,532,NULL,NULL),(2103,'completed','2025-11-23 17:12:38.116241','2025-11-23 17:13:11.953396',100,NULL,NULL,'ds','fwef','fwefwf',7,NULL,NULL,375,533,'wfwef','fwef'),(2104,'completed','2025-11-23 17:12:38.153015','2025-11-23 17:13:22.307673',100,NULL,NULL,'wefwe','wefwe','fwef',7,NULL,NULL,375,534,'fwef','fwef'),(2105,'completed','2025-11-23 17:12:38.181720','2025-11-23 17:13:31.050980',100,NULL,NULL,'wefwe','fwefw','ewwefwe',7,NULL,NULL,375,532,'ewfwe','eefwee'),(2106,'pending','2025-11-23 17:13:36.710885',NULL,0,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,375,533,NULL,NULL),(2107,'pending','2025-11-23 17:13:36.710885',NULL,0,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,375,534,NULL,NULL),(2108,'pending','2025-11-23 17:13:36.710885',NULL,0,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,375,532,NULL,NULL),(2109,'completed','2025-11-23 17:31:45.952978','2025-11-23 17:32:41.006183',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,376,539,NULL,NULL),(2110,'completed','2025-11-23 17:31:45.952978','2025-11-23 17:32:41.022202',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,376,540,NULL,NULL),(2111,'completed','2025-11-23 17:31:45.952978','2025-11-23 17:32:41.035758',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,376,538,NULL,NULL),(2112,'completed','2025-11-23 17:32:41.066738','2025-11-23 17:33:42.006100',100,'{\"answers\": [{\"word\": \"EMPRENDER\", \"answer\": \"EMPRENDER\"}, {\"word\": \"INNOVACION\", \"answer\": \"INNOVACION\"}, {\"word\": \"CREATIVIDAD\", \"answer\": \"CREATIVIDAD\"}], \"found_words\": [\"EQUIPO\", \"LIDER\", \"META\", \"PITCH\", \"IDEA\"], \"total_words\": 5, \"minigame_part\": \"anagram\", \"minigame_type\": \"anagrama\", \"tokens_earned\": 8, \"correct_answers\": 3, \"anagram_total_words\": 3, \"anagram_words_found\": 3, \"word_search_total_words\": 5, \"word_search_words_found\": 5}',NULL,NULL,NULL,NULL,2,NULL,NULL,376,539,NULL,NULL),(2113,'completed','2025-11-23 17:32:41.066738','2025-11-23 17:32:51.083512',100,'{\"type\": \"presentation\", \"completed\": true}',NULL,NULL,NULL,NULL,2,NULL,NULL,376,540,NULL,NULL),(2114,'completed','2025-11-23 17:32:41.066738','2025-11-23 17:32:55.632602',100,'{\"type\": \"presentation\", \"completed\": true}',NULL,NULL,NULL,NULL,2,NULL,NULL,376,538,NULL,NULL),(2115,'completed','2025-11-23 17:33:55.391178','2025-11-23 17:34:09.862476',100,NULL,NULL,NULL,NULL,NULL,3,3,1,377,539,NULL,NULL),(2116,'completed','2025-11-23 17:33:55.399149','2025-11-23 17:34:48.512076',100,NULL,NULL,NULL,NULL,NULL,3,5,2,377,540,NULL,NULL),(2117,'completed','2025-11-23 17:33:55.410710','2025-11-23 17:34:27.222141',100,NULL,NULL,NULL,NULL,NULL,3,9,3,377,538,NULL,NULL),(2118,'completed','2025-11-23 17:34:55.310847','2025-11-23 17:39:00.555826',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,377,539,NULL,NULL),(2119,'completed','2025-11-23 17:34:55.310847','2025-11-23 17:39:00.572017',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,377,540,NULL,NULL),(2120,'completed','2025-11-23 17:34:55.310847','2025-11-23 17:39:00.582051',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,377,538,NULL,NULL),(2121,'completed','2025-11-23 17:39:10.027624','2025-11-23 17:40:05.981167',100,NULL,'/media/prototypes/539_378_2b4e164c.jpg',NULL,NULL,NULL,6,NULL,NULL,378,539,NULL,NULL),(2122,'completed','2025-11-23 17:39:10.038183','2025-11-23 17:39:41.078971',100,NULL,'/media/prototypes/540_378_8bb06351.jpg',NULL,NULL,NULL,6,NULL,NULL,378,540,NULL,NULL),(2123,'completed','2025-11-23 17:39:10.048675','2025-11-23 17:39:30.052149',100,NULL,'/media/prototypes/538_378_544e6083.jpg',NULL,NULL,NULL,6,NULL,NULL,378,538,NULL,NULL),(2124,'completed','2025-11-23 17:40:17.115831','2025-11-23 17:40:44.448917',100,NULL,NULL,'guhu','hhuhh','gfhg',7,NULL,NULL,379,539,'vyugygiy','gyu'),(2125,'completed','2025-11-23 17:40:17.121778','2025-11-23 17:41:03.030440',100,NULL,NULL,'sjjss','shs','z sb',7,NULL,NULL,379,540,'sbsjs','ssbsb'),(2126,'completed','2025-11-23 17:40:17.131447','2025-11-23 17:41:16.921899',100,NULL,NULL,'hdhsjsv','sbsh','sjsj',7,NULL,NULL,379,538,'sbshw','vshsshs'),(2127,'completed','2025-11-23 17:41:22.813829','2025-11-23 17:45:05.155016',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,379,539,NULL,NULL),(2128,'completed','2025-11-23 17:41:22.813829','2025-11-23 17:45:35.393355',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,379,540,NULL,NULL),(2129,'completed','2025-11-23 17:41:22.813829','2025-11-23 17:44:30.188198',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,379,538,NULL,NULL),(2130,'completed','2025-11-23 17:54:53.482880','2025-11-23 17:56:13.852272',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,380,536,NULL,NULL),(2131,'completed','2025-11-23 17:54:53.482880','2025-11-23 17:56:13.864273',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,380,537,NULL,NULL),(2132,'completed','2025-11-23 17:54:53.482880','2025-11-23 17:56:13.869469',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,380,535,NULL,NULL),(2133,'completed','2025-11-23 17:56:13.878431','2025-11-23 17:56:37.388316',100,'{\"type\": \"presentation\", \"completed\": true}',NULL,NULL,NULL,NULL,2,NULL,NULL,380,536,NULL,NULL),(2134,'completed','2025-11-23 17:56:13.878431','2025-11-23 17:56:40.498526',100,'{\"type\": \"presentation\", \"completed\": true}',NULL,NULL,NULL,NULL,2,NULL,NULL,380,537,NULL,NULL),(2135,'completed','2025-11-23 17:56:13.878431','2025-11-23 18:03:49.525032',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,380,535,NULL,NULL),(2136,'completed','2025-11-23 18:04:01.424501','2025-11-23 18:04:07.648580',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,381,536,NULL,NULL),(2137,'completed','2025-11-23 18:04:01.436464','2025-11-23 18:04:07.661322',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,381,537,NULL,NULL),(2138,'completed','2025-11-23 18:04:01.443920','2025-11-23 18:04:07.666288',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,381,535,NULL,NULL),(2139,'completed','2025-11-23 18:04:07.676886','2025-11-23 18:04:10.490923',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,381,536,NULL,NULL),(2140,'completed','2025-11-23 18:04:07.676886','2025-11-23 18:04:10.496179',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,381,537,NULL,NULL),(2141,'completed','2025-11-23 18:04:07.676886','2025-11-23 18:04:10.501876',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,381,535,NULL,NULL),(2142,'completed','2025-11-23 18:04:14.259435','2025-11-23 18:04:19.344573',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,382,536,NULL,NULL),(2143,'completed','2025-11-23 18:04:14.265094','2025-11-23 18:04:19.355561',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,382,537,NULL,NULL),(2144,'completed','2025-11-23 18:04:14.271680','2025-11-23 18:04:19.360598',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,382,535,NULL,NULL),(2145,'completed','2025-11-23 18:04:21.978954','2025-11-23 18:05:05.573849',100,NULL,NULL,'hsshs','hsbss','djzjs',7,NULL,NULL,383,536,'sjss','jsjsbdjd'),(2146,'completed','2025-11-23 18:04:21.985370','2025-11-23 18:04:51.565480',100,NULL,NULL,'hsjss','zjzdhdjs','bdjdjd',7,NULL,NULL,383,537,'djdjd','jsjs'),(2147,'completed','2025-11-23 18:04:21.991399','2025-11-23 18:05:23.093383',100,NULL,NULL,'sjjw','ssj','jsjs',7,NULL,NULL,383,535,'ssjsj','sjsjs'),(2148,'completed','2025-11-23 18:05:27.857486','2025-11-23 18:06:46.935098',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,383,536,NULL,NULL),(2149,'completed','2025-11-23 18:05:27.857486','2025-11-23 18:06:23.641074',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,383,537,NULL,NULL),(2150,'completed','2025-11-23 18:05:27.857486','2025-11-23 18:05:57.887538',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,383,535,NULL,NULL),(2151,'completed','2025-11-23 18:19:20.310552','2025-11-23 18:19:24.849283',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,384,545,NULL,NULL),(2152,'completed','2025-11-23 18:19:20.310552','2025-11-23 18:19:24.863889',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,384,546,NULL,NULL),(2153,'completed','2025-11-23 18:19:20.310552','2025-11-23 18:19:24.912394',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,384,544,NULL,NULL),(2154,'completed','2025-11-23 18:19:24.925780','2025-11-23 18:19:30.160706',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,384,545,NULL,NULL),(2155,'completed','2025-11-23 18:19:24.925780','2025-11-23 18:19:30.179549',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,384,546,NULL,NULL),(2156,'completed','2025-11-23 18:19:24.925780','2025-11-23 18:19:30.183586',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,384,544,NULL,NULL),(2157,'completed','2025-11-23 18:19:35.847129','2025-11-23 18:19:40.890257',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,385,545,NULL,NULL),(2158,'completed','2025-11-23 18:19:35.856947','2025-11-23 18:19:40.902912',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,385,546,NULL,NULL),(2159,'completed','2025-11-23 18:19:35.864957','2025-11-23 18:19:40.907941',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,385,544,NULL,NULL),(2160,'completed','2025-11-23 18:19:40.921358','2025-11-23 18:19:47.402518',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,385,545,NULL,NULL),(2161,'completed','2025-11-23 18:19:40.921358','2025-11-23 18:19:47.417522',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,385,546,NULL,NULL),(2162,'completed','2025-11-23 18:19:40.921358','2025-11-23 18:19:47.423483',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,385,544,NULL,NULL),(2163,'completed','2025-11-23 18:19:52.332507','2025-11-23 18:21:56.538499',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,386,545,NULL,NULL),(2164,'completed','2025-11-23 18:19:52.337929','2025-11-23 18:21:56.544498',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,386,546,NULL,NULL),(2165,'completed','2025-11-23 18:19:52.342108','2025-11-23 18:21:56.553535',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,386,544,NULL,NULL),(2166,'completed','2025-11-23 18:22:06.455666','2025-11-23 18:22:14.265157',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,387,545,NULL,NULL),(2167,'completed','2025-11-23 18:22:06.460822','2025-11-23 18:22:14.271161',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,387,546,NULL,NULL),(2168,'completed','2025-11-23 18:22:06.464665','2025-11-23 18:22:14.275164',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,387,544,NULL,NULL),(2169,'completed','2025-11-23 18:22:14.284162','2025-11-23 18:23:00.579355',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,387,545,NULL,NULL),(2170,'completed','2025-11-23 18:22:14.284162','2025-11-23 18:22:47.694173',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,387,546,NULL,NULL),(2171,'completed','2025-11-23 18:22:14.284162','2025-11-23 18:22:32.642721',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,387,544,NULL,NULL),(2172,'completed','2025-11-23 18:26:49.610452','2025-11-23 18:27:00.676526',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,388,542,NULL,NULL),(2173,'completed','2025-11-23 18:26:49.610452','2025-11-23 18:27:00.681531',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,388,543,NULL,NULL),(2174,'completed','2025-11-23 18:26:49.610452','2025-11-23 18:27:00.685561',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,388,541,NULL,NULL),(2175,'completed','2025-11-23 18:27:00.692562','2025-11-23 18:27:06.500273',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,388,542,NULL,NULL),(2176,'completed','2025-11-23 18:27:00.692562','2025-11-23 18:27:06.510300',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,388,543,NULL,NULL),(2177,'completed','2025-11-23 18:27:00.692562','2025-11-23 18:27:06.515311',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,388,541,NULL,NULL),(2178,'completed','2025-11-23 18:27:11.977236','2025-11-23 18:27:17.362002',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,389,542,NULL,NULL),(2179,'completed','2025-11-23 18:27:11.984232','2025-11-23 18:27:17.400839',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,389,543,NULL,NULL),(2180,'completed','2025-11-23 18:27:11.994236','2025-11-23 18:27:17.405838',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,389,541,NULL,NULL),(2181,'completed','2025-11-23 18:27:17.416838','2025-11-23 18:27:21.551385',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,389,542,NULL,NULL),(2182,'completed','2025-11-23 18:27:17.416838','2025-11-23 18:27:21.561438',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,389,543,NULL,NULL),(2183,'completed','2025-11-23 18:27:17.416838','2025-11-23 18:27:21.568551',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,389,541,NULL,NULL),(2184,'completed','2025-11-23 18:27:25.564898','2025-11-23 18:27:31.559594',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,390,542,NULL,NULL),(2185,'completed','2025-11-23 18:27:25.569898','2025-11-23 18:27:31.568611',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,390,543,NULL,NULL),(2186,'completed','2025-11-23 18:27:25.575905','2025-11-23 18:27:31.573575',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,390,541,NULL,NULL),(2187,'completed','2025-11-23 18:27:34.081177','2025-11-23 18:27:40.129808',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,391,542,NULL,NULL),(2188,'completed','2025-11-23 18:27:34.086204','2025-11-23 18:27:40.140808',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,391,543,NULL,NULL),(2189,'completed','2025-11-23 18:27:34.090793','2025-11-23 18:27:40.144808',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,391,541,NULL,NULL),(2190,'completed','2025-11-23 18:27:40.152808','2025-11-23 18:29:09.372088',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,391,542,NULL,NULL),(2191,'completed','2025-11-23 18:27:40.152808','2025-11-23 18:28:53.693844',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,391,543,NULL,NULL),(2192,'completed','2025-11-23 18:27:40.152808','2025-11-23 18:29:27.606720',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,391,541,NULL,NULL),(2193,'completed','2025-11-23 18:37:56.624020','2025-11-23 18:38:01.125958',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,392,551,NULL,NULL),(2194,'completed','2025-11-23 18:37:56.624020','2025-11-23 18:38:01.138039',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,392,552,NULL,NULL),(2195,'completed','2025-11-23 18:37:56.624020','2025-11-23 18:38:01.145706',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,392,550,NULL,NULL),(2196,'completed','2025-11-23 18:38:01.155773','2025-11-23 18:38:07.349246',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,392,551,NULL,NULL),(2197,'completed','2025-11-23 18:38:01.155773','2025-11-23 18:38:07.362678',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,392,552,NULL,NULL),(2198,'completed','2025-11-23 18:38:01.155773','2025-11-23 18:38:07.367882',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,392,550,NULL,NULL),(2199,'completed','2025-11-23 18:38:13.150596','2025-11-23 18:38:18.094330',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,393,551,NULL,NULL),(2200,'completed','2025-11-23 18:38:13.162307','2025-11-23 18:38:18.110408',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,393,552,NULL,NULL),(2201,'completed','2025-11-23 18:38:13.167419','2025-11-23 18:38:18.122616',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,393,550,NULL,NULL),(2202,'completed','2025-11-23 18:38:18.137655','2025-11-23 18:38:22.460384',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,393,551,NULL,NULL),(2203,'completed','2025-11-23 18:38:18.137655','2025-11-23 18:38:22.471680',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,393,552,NULL,NULL),(2204,'completed','2025-11-23 18:38:18.137655','2025-11-23 18:38:22.476685',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,393,550,NULL,NULL),(2205,'completed','2025-11-23 18:38:26.441301','2025-11-23 18:38:34.594794',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,394,551,NULL,NULL),(2206,'completed','2025-11-23 18:38:26.446432','2025-11-23 18:38:34.606829',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,394,552,NULL,NULL),(2207,'completed','2025-11-23 18:38:26.454944','2025-11-23 18:38:34.611796',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,394,550,NULL,NULL),(2208,'completed','2025-11-23 18:38:37.482562','2025-11-23 18:38:41.527225',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,395,551,NULL,NULL),(2209,'completed','2025-11-23 18:38:37.487605','2025-11-23 18:38:41.550814',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,395,552,NULL,NULL),(2210,'completed','2025-11-23 18:38:37.492294','2025-11-23 18:38:41.555814',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,395,550,NULL,NULL),(2211,'completed','2025-11-23 18:38:41.564815','2025-11-23 18:38:57.546002',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,395,551,NULL,NULL),(2212,'completed','2025-11-23 18:38:41.564815','2025-11-23 18:39:25.038707',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,395,552,NULL,NULL),(2213,'completed','2025-11-23 18:38:41.564815','2025-11-23 18:39:09.044792',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,395,550,NULL,NULL),(2214,'completed','2025-11-23 18:43:39.132520','2025-11-23 18:43:44.225593',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,396,548,NULL,NULL),(2215,'completed','2025-11-23 18:43:39.132520','2025-11-23 18:43:44.236480',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,396,549,NULL,NULL),(2216,'completed','2025-11-23 18:43:39.132520','2025-11-23 18:43:44.240486',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,396,547,NULL,NULL),(2217,'completed','2025-11-23 18:43:44.251379','2025-11-23 18:43:47.636158',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,396,548,NULL,NULL),(2218,'completed','2025-11-23 18:43:44.251379','2025-11-23 18:43:47.647159',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,396,549,NULL,NULL),(2219,'completed','2025-11-23 18:43:44.251379','2025-11-23 18:43:47.652180',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,396,547,NULL,NULL),(2220,'completed','2025-11-23 18:43:53.526951','2025-11-23 18:43:58.706772',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,397,548,NULL,NULL),(2221,'completed','2025-11-23 18:43:53.531914','2025-11-23 18:43:58.720811',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,397,549,NULL,NULL),(2222,'completed','2025-11-23 18:43:53.536914','2025-11-23 18:43:58.728780',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,397,547,NULL,NULL),(2223,'completed','2025-11-23 18:43:58.742771','2025-11-23 18:44:04.261595',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,397,548,NULL,NULL),(2224,'completed','2025-11-23 18:43:58.742771','2025-11-23 18:44:04.271595',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,397,549,NULL,NULL),(2225,'completed','2025-11-23 18:43:58.742771','2025-11-23 18:44:04.275598',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,397,547,NULL,NULL),(2226,'completed','2025-11-23 18:44:09.087778','2025-11-23 18:44:14.930882',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,398,548,NULL,NULL),(2227,'completed','2025-11-23 18:44:09.091778','2025-11-23 18:44:14.940913',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,398,549,NULL,NULL),(2228,'completed','2025-11-23 18:44:09.095777','2025-11-23 18:44:14.950919',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,398,547,NULL,NULL),(2229,'completed','2025-11-23 18:45:04.293110','2025-11-23 18:45:09.595235',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,399,548,NULL,NULL),(2230,'completed','2025-11-23 18:45:04.298109','2025-11-23 18:45:09.605758',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,399,549,NULL,NULL),(2231,'completed','2025-11-23 18:45:04.302751','2025-11-23 18:45:09.609752',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,399,547,NULL,NULL),(2232,'completed','2025-11-23 18:45:09.617747','2025-11-23 18:45:43.772773',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,399,548,NULL,NULL),(2233,'completed','2025-11-23 18:45:09.617747','2025-11-23 18:45:50.751171',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,399,549,NULL,NULL),(2234,'completed','2025-11-23 18:45:09.617747','2025-11-23 18:45:50.756169',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,399,547,NULL,NULL),(2235,'completed','2025-11-23 18:47:26.691664','2025-11-23 18:47:31.340031',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,400,557,NULL,NULL),(2236,'completed','2025-11-23 18:47:26.691664','2025-11-23 18:47:31.351047',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,400,558,NULL,NULL),(2237,'completed','2025-11-23 18:47:26.691664','2025-11-23 18:47:31.357079',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,400,556,NULL,NULL),(2238,'completed','2025-11-23 18:47:31.366677','2025-11-23 18:47:36.468521',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,400,557,NULL,NULL),(2239,'completed','2025-11-23 18:47:31.366677','2025-11-23 18:47:36.488608',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,400,558,NULL,NULL),(2240,'completed','2025-11-23 18:47:31.366677','2025-11-23 18:47:36.504990',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,400,556,NULL,NULL),(2241,'completed','2025-11-23 18:47:43.884464','2025-11-23 18:47:48.598217',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,401,557,NULL,NULL),(2242,'completed','2025-11-23 18:47:43.891505','2025-11-23 18:47:48.614992',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,401,558,NULL,NULL),(2243,'completed','2025-11-23 18:47:43.901021','2025-11-23 18:47:48.626566',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,401,556,NULL,NULL),(2244,'completed','2025-11-23 18:47:48.645781','2025-11-23 18:47:55.441320',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,401,557,NULL,NULL),(2245,'completed','2025-11-23 18:47:48.645781','2025-11-23 18:47:55.455745',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,401,558,NULL,NULL),(2246,'completed','2025-11-23 18:47:48.645781','2025-11-23 18:47:55.461780',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,401,556,NULL,NULL),(2247,'completed','2025-11-23 18:48:00.910322','2025-11-23 18:48:07.088448',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,402,557,NULL,NULL),(2248,'completed','2025-11-23 18:48:00.914841','2025-11-23 18:48:07.107534',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,402,558,NULL,NULL),(2249,'completed','2025-11-23 18:48:00.925031','2025-11-23 18:48:07.117144',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,402,556,NULL,NULL),(2250,'completed','2025-11-23 18:48:09.926635','2025-11-23 18:48:15.568931',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,403,557,NULL,NULL),(2251,'completed','2025-11-23 18:48:09.940375','2025-11-23 18:48:15.577550',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,403,558,NULL,NULL),(2252,'completed','2025-11-23 18:48:09.953347','2025-11-23 18:48:15.586178',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,403,556,NULL,NULL),(2253,'completed','2025-11-23 18:48:15.602859','2025-11-23 18:49:31.632515',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,403,557,NULL,NULL),(2254,'completed','2025-11-23 18:48:15.602859','2025-11-23 18:49:01.788642',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,403,558,NULL,NULL),(2255,'completed','2025-11-23 18:48:15.602859','2025-11-23 18:49:16.533724',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,403,556,NULL,NULL),(2256,'completed','2025-11-23 18:52:47.115645','2025-11-23 18:52:50.587768',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,404,554,NULL,NULL),(2257,'completed','2025-11-23 18:52:47.115645','2025-11-23 18:52:50.598794',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,404,555,NULL,NULL),(2258,'completed','2025-11-23 18:52:47.115645','2025-11-23 18:52:50.605757',100,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,404,553,NULL,NULL),(2259,'completed','2025-11-23 18:52:50.616791','2025-11-23 18:52:55.113058',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,404,554,NULL,NULL),(2260,'completed','2025-11-23 18:52:50.616791','2025-11-23 18:52:55.123097',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,404,555,NULL,NULL),(2261,'completed','2025-11-23 18:52:50.616791','2025-11-23 18:52:55.127094',100,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,404,553,NULL,NULL),(2262,'completed','2025-11-23 18:52:59.519548','2025-11-23 18:53:04.155201',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,405,554,NULL,NULL),(2263,'completed','2025-11-23 18:52:59.526055','2025-11-23 18:53:04.160172',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,405,555,NULL,NULL),(2264,'completed','2025-11-23 18:52:59.533065','2025-11-23 18:53:04.165174',100,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,405,553,NULL,NULL),(2265,'completed','2025-11-23 18:53:04.173173','2025-11-23 18:53:08.213767',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,405,554,NULL,NULL),(2266,'completed','2025-11-23 18:53:04.173173','2025-11-23 18:53:08.222773',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,405,555,NULL,NULL),(2267,'completed','2025-11-23 18:53:04.173173','2025-11-23 18:53:08.230767',100,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,405,553,NULL,NULL),(2268,'completed','2025-11-23 18:53:12.610284','2025-11-23 18:53:17.641033',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,406,554,NULL,NULL),(2269,'completed','2025-11-23 18:53:12.618244','2025-11-23 18:53:17.649036',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,406,555,NULL,NULL),(2270,'completed','2025-11-23 18:53:12.624242','2025-11-23 18:53:17.655037',100,NULL,NULL,NULL,NULL,NULL,6,NULL,NULL,406,553,NULL,NULL),(2271,'completed','2025-11-23 18:53:21.135337','2025-11-23 18:53:25.653965',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,407,554,NULL,NULL),(2272,'completed','2025-11-23 18:53:21.140338','2025-11-23 18:53:25.663512',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,407,555,NULL,NULL),(2273,'completed','2025-11-23 18:53:21.144219','2025-11-23 18:53:25.667542',100,NULL,NULL,NULL,NULL,NULL,7,NULL,NULL,407,553,NULL,NULL),(2274,'completed','2025-11-23 18:53:25.674872','2025-11-23 18:54:16.121414',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,407,554,NULL,NULL),(2275,'completed','2025-11-23 18:53:25.674872','2025-11-23 18:54:16.126419',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,407,555,NULL,NULL),(2276,'completed','2025-11-23 18:53:25.674872','2025-11-23 18:54:16.132423',100,NULL,NULL,NULL,NULL,NULL,8,NULL,NULL,407,553,NULL,NULL);
/*!40000 ALTER TABLE `team_activity_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_bubble_maps`
--

DROP TABLE IF EXISTS `team_bubble_maps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_bubble_maps` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `map_data` json NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `session_stage_id` bigint NOT NULL,
  `team_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team_bubble_maps_team_id_session_stage_id_17b57cd0_uniq` (`team_id`,`session_stage_id`),
  KEY `team_bubble_team_id_9bb24e_idx` (`team_id`),
  KEY `team_bubble_session_86d871_idx` (`session_stage_id`),
  CONSTRAINT `team_bubble_maps_session_stage_id_49de9bcb_fk_session_stages_id` FOREIGN KEY (`session_stage_id`) REFERENCES `session_stages` (`id`),
  CONSTRAINT `team_bubble_maps_team_id_fbae9ea2_fk_teams_id` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=179 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_bubble_maps`
--

LOCK TABLES `team_bubble_maps` WRITE;
/*!40000 ALTER TABLE `team_bubble_maps` DISABLE KEYS */;
INSERT INTO `team_bubble_maps` VALUES (173,'{\"central\": {\"personName\": \"Humberto\", \"profileImage\": \"/media/personas/perfil-ia-1763366872037.png\"}, \"questions\": [{\"id\": 1, \"answers\": [{\"id\": 1, \"text\": \"wefwefw\"}, {\"id\": 2, \"text\": \"rrht\"}], \"question\": \"¿Qué le gusta?\", \"isOptional\": false}, {\"id\": 2, \"answers\": [{\"id\": 1, \"text\": \"dwedw\"}, {\"id\": 2, \"text\": \"gegr\"}], \"question\": \"¿Qué no le gusta?\", \"isOptional\": false}, {\"id\": 3, \"answers\": [{\"id\": 1, \"text\": \"vwre\"}, {\"id\": 2, \"text\": \"gre\"}], \"question\": \"¿Qué obstáculos está enfrentando?\", \"isOptional\": false}, {\"id\": 4, \"answers\": [{\"id\": 1, \"text\": \"fegr\"}, {\"id\": 2, \"text\": \"vrevr\"}], \"question\": \"¿Qué le dicen los demás?\", \"isOptional\": false}, {\"id\": 5, \"answers\": [{\"id\": 1, \"text\": \"brt\"}, {\"id\": 2, \"text\": \"nty\"}], \"question\": \"¿Cuáles son sus hobbies?\", \"isOptional\": false}]}','2025-11-23 17:08:16.122427','2025-11-23 17:08:36.005787',373,533),(174,'{\"central\": {\"personName\": \"Andrés\", \"profileImage\": \"/media/personas/persona-profile_4.jpg\"}, \"questions\": [{\"id\": 1, \"answers\": [{\"id\": 1, \"text\": \"fwefw\"}, {\"id\": 2, \"text\": \"ukkyuy\"}, {\"id\": 3, \"text\": \"uyhk\"}], \"question\": \"¿Qué le gusta?\", \"isOptional\": false}, {\"id\": 2, \"answers\": [{\"id\": 1, \"text\": \"vsdvsd\"}, {\"id\": 2, \"text\": \"wefwe\"}, {\"id\": 3, \"text\": \"f\"}, {\"id\": 4, \"text\": \"we\"}, {\"id\": 5, \"text\": \"few\"}], \"question\": \"¿Qué no le gusta?\", \"isOptional\": false}, {\"id\": 3, \"answers\": [{\"id\": 1, \"text\": \"wefwe\"}, {\"id\": 2, \"text\": \"fefwe\"}, {\"id\": 3, \"text\": \"erg\"}], \"question\": \"¿Qué obstáculos está enfrentando?\", \"isOptional\": false}, {\"id\": 4, \"answers\": [{\"id\": 1, \"text\": \"freg\"}, {\"id\": 2, \"text\": \"dgf\"}, {\"id\": 3, \"text\": \"bfe\"}], \"question\": \"¿Qué le dicen los demás?\", \"isOptional\": false}, {\"id\": 5, \"answers\": [{\"id\": 1, \"text\": \"cweeef\"}, {\"id\": 2, \"text\": \"vdfvfv\"}, {\"id\": 3, \"text\": \"fvd\"}], \"question\": \"¿Cuáles son sus hobbies?\", \"isOptional\": false}]}','2025-11-23 17:08:49.745927','2025-11-23 17:09:17.966411',373,534),(175,'{\"central\": {\"personName\": \"Gabriela\", \"profileImage\": \"/media/personas/persona-profile_2.jpg\"}, \"questions\": [{\"id\": 1, \"answers\": [{\"id\": 1, \"text\": \"dwedwe\"}, {\"id\": 2, \"text\": \"trhrth\"}, {\"id\": 3, \"text\": \"ferg\"}], \"question\": \"¿Qué le gusta?\", \"isOptional\": false}, {\"id\": 2, \"answers\": [{\"id\": 1, \"text\": \"vrregerg\"}, {\"id\": 2, \"text\": \"gtgt\"}], \"question\": \"¿Qué no le gusta?\", \"isOptional\": false}, {\"id\": 3, \"answers\": [{\"id\": 1, \"text\": \"erferg\"}, {\"id\": 2, \"text\": \"verferg\"}], \"question\": \"¿Qué obstáculos está enfrentando?\", \"isOptional\": false}, {\"id\": 4, \"answers\": [{\"id\": 1, \"text\": \"ergrger\"}, {\"id\": 2, \"text\": \"fefr\"}], \"question\": \"¿Qué le dicen los demás?\", \"isOptional\": false}, {\"id\": 5, \"answers\": [{\"id\": 1, \"text\": \"reerg\"}, {\"id\": 2, \"text\": \"hrhrth\"}], \"question\": \"¿Cuáles son sus hobbies?\", \"isOptional\": false}]}','2025-11-23 17:09:22.400048','2025-11-23 17:09:46.706409',373,532),(176,'{\"central\": {\"personName\": \"Juana\", \"profileImage\": \"/media/personas/persona-profile_6.jpg\"}, \"questions\": [{\"id\": 1, \"answers\": [{\"id\": 1, \"text\": \"wfjwef\"}, {\"id\": 2, \"text\": \"fwef\"}, {\"id\": 3, \"text\": \"fwef\"}], \"question\": \"¿Qué le gusta?\", \"isOptional\": false}, {\"id\": 2, \"answers\": [{\"id\": 1, \"text\": \"fwefw\"}, {\"id\": 2, \"text\": \"efwe\"}], \"question\": \"¿Qué no le gusta?\", \"isOptional\": false}, {\"id\": 3, \"answers\": [{\"id\": 1, \"text\": \"fwefw\"}, {\"id\": 2, \"text\": \"fewf\"}], \"question\": \"¿Qué obstáculos está enfrentando?\", \"isOptional\": false}, {\"id\": 4, \"answers\": [{\"id\": 1, \"text\": \"fwefw\"}, {\"id\": 2, \"text\": \"fewf\"}], \"question\": \"¿Qué le dicen los demás?\", \"isOptional\": false}, {\"id\": 5, \"answers\": [{\"id\": 1, \"text\": \"fwefw\"}, {\"id\": 2, \"text\": \"fwe\"}, {\"id\": 3, \"text\": \"fwe\"}, {\"id\": 4, \"text\": \"fwefwe\"}], \"question\": \"¿Cuáles son sus hobbies?\", \"isOptional\": false}]}','2025-11-23 17:35:08.229786','2025-11-23 17:35:24.767545',377,539),(177,'{\"central\": {\"personName\": \"Andrés\", \"profileImage\": \"/media/personas/persona-profile_4.jpg\"}, \"questions\": [{\"id\": 1, \"answers\": [{\"id\": 1, \"text\": \"GSHGWJS\"}, {\"id\": 2, \"text\": \"WQSQ\"}], \"question\": \"¿Qué le gusta?\", \"isOptional\": false}, {\"id\": 2, \"answers\": [{\"id\": 1, \"text\": \"shshsh\"}, {\"id\": 2, \"text\": \"sbshs\"}], \"question\": \"¿Qué no le gusta?\", \"isOptional\": false}, {\"id\": 3, \"answers\": [{\"id\": 1, \"text\": \"bshs\"}, {\"id\": 2, \"text\": \"jsjssh\"}], \"question\": \"¿Qué obstáculos está enfrentando?\", \"isOptional\": false}, {\"id\": 4, \"answers\": [{\"id\": 1, \"text\": \"ydhsjs\"}, {\"id\": 2, \"text\": \"sjsjsj\"}], \"question\": \"¿Qué le dicen los demás?\", \"isOptional\": false}, {\"id\": 5, \"answers\": [{\"id\": 1, \"text\": \"hssh\"}, {\"id\": 2, \"text\": \"hdjs\"}], \"question\": \"¿Cuáles son sus hobbies?\", \"isOptional\": false}]}','2025-11-23 17:35:37.754869','2025-11-23 17:38:55.107438',377,540),(178,'{\"central\": {\"personName\": \"Francisco\", \"profileImage\": \"/media/personas/persona-profile.jpg\"}, \"questions\": [{\"id\": 1, \"answers\": [{\"id\": 1, \"text\": \"sjksjs\"}, {\"id\": 2, \"text\": \"dhdhs\"}], \"question\": \"¿Qué le gusta?\", \"isOptional\": false}, {\"id\": 2, \"answers\": [{\"id\": 1, \"text\": \"dbsjs\"}, {\"id\": 2, \"text\": \"dbdbs\"}], \"question\": \"¿Qué no le gusta?\", \"isOptional\": false}, {\"id\": 3, \"answers\": [{\"id\": 1, \"text\": \"djsjsjs\"}, {\"id\": 2, \"text\": \"sbsjs\"}], \"question\": \"¿Qué obstáculos está enfrentando?\", \"isOptional\": false}, {\"id\": 4, \"answers\": [{\"id\": 1, \"text\": \"svshsh\"}, {\"id\": 2, \"text\": \"dbsjjs\"}], \"question\": \"¿Qué le dicen los demás?\", \"isOptional\": false}, {\"id\": 5, \"answers\": [{\"id\": 1, \"text\": \"shsjs\"}, {\"id\": 2, \"text\": \"jssjsj\"}], \"question\": \"¿Cuáles son sus hobbies?\", \"isOptional\": false}]}','2025-11-23 17:37:32.807910','2025-11-23 17:37:59.126681',377,538);
/*!40000 ALTER TABLE `team_bubble_maps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_personalization`
--

DROP TABLE IF EXISTS `team_personalization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_personalization` (
  `team_id` bigint NOT NULL,
  `team_name` varchar(100) DEFAULT NULL,
  `team_members_know_each_other` tinyint(1) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`team_id`),
  CONSTRAINT `team_personalization_team_id_711bccdd_fk_teams_id` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_personalization`
--

LOCK TABLES `team_personalization` WRITE;
/*!40000 ALTER TABLE `team_personalization` DISABLE KEYS */;
INSERT INTO `team_personalization` VALUES (532,'sada',0,'2025-11-23 17:04:56.400902','2025-11-23 17:04:56.400902'),(533,'dasdasd',0,'2025-11-23 17:04:40.785961','2025-11-23 17:04:40.785961'),(534,'dasdsa',1,'2025-11-23 17:05:09.031844','2025-11-23 17:05:09.031844'),(535,'jsjs',1,'2025-11-23 17:55:36.928946','2025-11-23 17:55:36.928946'),(536,'hqhqq',0,'2025-11-23 17:56:00.064104','2025-11-23 17:56:00.064104'),(537,'hajaja',0,'2025-11-23 17:56:07.997977','2025-11-23 17:56:07.997977'),(538,'3232',0,'2025-11-23 17:32:06.542408','2025-11-23 17:32:06.543448'),(539,'67r5476',1,'2025-11-23 17:32:14.701252','2025-11-23 17:32:14.701252'),(540,'7665',0,'2025-11-23 17:32:32.930147','2025-11-23 17:32:32.930147');
/*!40000 ALTER TABLE `team_personalization` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_roulette_assignments`
--

DROP TABLE IF EXISTS `team_roulette_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_roulette_assignments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `status` varchar(20) NOT NULL,
  `token_reward` int NOT NULL,
  `assigned_at` datetime(6) NOT NULL,
  `accepted_at` datetime(6) DEFAULT NULL,
  `rejected_at` datetime(6) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `roulette_challenge_id` bigint NOT NULL,
  `session_stage_id` bigint NOT NULL,
  `team_id` bigint NOT NULL,
  `validated_by_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `team_roulet_team_id_af552c_idx` (`team_id`),
  KEY `team_roulet_roulett_8c9155_idx` (`roulette_challenge_id`),
  KEY `team_roulet_status_d5a38d_idx` (`status`),
  KEY `team_roulette_assign_session_stage_id_c5a1861e_fk_session_s` (`session_stage_id`),
  KEY `team_roulette_assign_validated_by_id_8dad8bd1_fk_professor` (`validated_by_id`),
  CONSTRAINT `team_roulette_assign_roulette_challenge_i_1483d73e_fk_roulette_` FOREIGN KEY (`roulette_challenge_id`) REFERENCES `roulette_challenges` (`id`),
  CONSTRAINT `team_roulette_assign_session_stage_id_c5a1861e_fk_session_s` FOREIGN KEY (`session_stage_id`) REFERENCES `session_stages` (`id`),
  CONSTRAINT `team_roulette_assign_validated_by_id_8dad8bd1_fk_professor` FOREIGN KEY (`validated_by_id`) REFERENCES `professors` (`id`),
  CONSTRAINT `team_roulette_assignments_team_id_6bae2cdf_fk_teams_id` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_roulette_assignments`
--

LOCK TABLES `team_roulette_assignments` WRITE;
/*!40000 ALTER TABLE `team_roulette_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_roulette_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_students`
--

DROP TABLE IF EXISTS `team_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_students` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `team_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team_students_team_id_student_id_1fd980a1_uniq` (`team_id`,`student_id`),
  KEY `team_studen_student_28cbe0_idx` (`student_id`),
  CONSTRAINT `team_students_student_id_c1a42457_fk_students_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `team_students_team_id_b4fd8642_fk_teams_id` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4221 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_students`
--

LOCK TABLES `team_students` WRITE;
/*!40000 ALTER TABLE `team_students` DISABLE KEYS */;
INSERT INTO `team_students` VALUES (4018,1,532),(4020,3,532),(4022,4,532),(4019,12,532),(4021,15,532),(4017,16,532),(4027,2,533),(4026,8,533),(4024,9,533),(4025,10,533),(4028,13,533),(4023,17,533),(4029,5,534),(4031,6,534),(4033,7,534),(4030,11,534),(4032,14,534),(4038,23,535),(4034,28,535),(4036,30,535),(4039,31,535),(4035,34,535),(4041,38,535),(4037,39,535),(4040,40,535),(4047,19,536),(4044,20,536),(4048,22,536),(4049,24,536),(4045,25,536),(4042,26,536),(4046,29,536),(4043,37,536),(4052,18,537),(4054,21,537),(4053,27,537),(4051,32,537),(4050,33,537),(4056,35,537),(4055,36,537),(4060,41,538),(4061,42,538),(4058,43,538),(4062,49,538),(4057,51,538),(4064,53,538),(4063,56,538),(4059,62,538),(4067,45,539),(4070,46,539),(4081,48,539),(4068,52,539),(4069,54,539),(4066,61,539),(4071,63,539),(4079,44,540),(4075,47,540),(4078,50,540),(4080,55,540),(4082,57,540),(4076,58,540),(4073,59,540),(4074,60,540),(4085,20,541),(4083,23,541),(4087,25,541),(4090,29,541),(4084,31,541),(4089,32,541),(4088,36,541),(4086,37,541),(4094,19,542),(4097,22,542),(4093,24,542),(4091,27,542),(4098,28,542),(4092,33,542),(4095,39,542),(4096,40,542),(4103,18,543),(4100,21,543),(4105,26,543),(4101,30,543),(4099,34,543),(4104,35,543),(4102,38,543),(4109,43,544),(4111,46,544),(4112,48,544),(4107,49,544),(4113,52,544),(4110,54,544),(4106,55,544),(4108,56,544),(4114,42,545),(4117,45,545),(4119,47,545),(4120,51,545),(4118,53,545),(4121,57,545),(4115,58,545),(4116,63,545),(4122,41,546),(4123,44,546),(4128,50,546),(4127,59,546),(4124,60,546),(4126,61,546),(4125,62,546),(4134,18,547),(4135,19,547),(4131,22,547),(4132,26,547),(4129,27,547),(4136,32,547),(4133,36,547),(4130,37,547),(4137,23,548),(4140,24,548),(4141,25,548),(4139,28,548),(4144,30,548),(4138,31,548),(4142,34,548),(4143,38,548),(4148,20,549),(4149,21,549),(4145,29,549),(4146,33,549),(4150,35,549),(4151,39,549),(4147,40,549),(4159,42,550),(4152,44,550),(4156,47,550),(4154,48,550),(4155,52,550),(4157,58,550),(4158,61,550),(4153,62,550),(4162,41,551),(4167,43,551),(4164,46,551),(4163,53,551),(4161,55,551),(4166,56,551),(4160,57,551),(4165,60,551),(4173,45,552),(4169,49,552),(4170,50,552),(4174,51,552),(4172,54,552),(4171,59,552),(4168,63,552),(4178,18,553),(4176,21,553),(4182,22,553),(4181,26,553),(4177,29,553),(4180,33,553),(4179,35,553),(4175,38,553),(4186,20,554),(4187,23,554),(4190,25,554),(4184,27,554),(4185,28,554),(4188,30,554),(4183,37,554),(4189,40,554),(4193,19,555),(4194,24,555),(4195,31,555),(4192,32,555),(4196,34,555),(4191,36,555),(4197,39,555),(4198,45,556),(4202,46,556),(4199,47,556),(4203,48,556),(4200,50,556),(4201,57,556),(4204,59,556),(4205,63,556),(4211,42,557),(4208,43,557),(4210,44,557),(4206,52,557),(4212,54,557),(4207,55,557),(4213,58,557),(4209,62,557),(4218,41,558),(4217,49,558),(4220,51,558),(4215,53,558),(4214,56,558),(4216,60,558),(4219,61,558);
/*!40000 ALTER TABLE `team_students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `color` varchar(50) NOT NULL,
  `tokens_total` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `game_session_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `teams_game_session_id_name_c9e89b99_uniq` (`game_session_id`,`name`),
  KEY `teams_game_se_7d8aab_idx` (`game_session_id`),
  KEY `teams_color_56beec_idx` (`color`),
  CONSTRAINT `teams_game_session_id_d946ac99_fk_game_sessions_id` FOREIGN KEY (`game_session_id`) REFERENCES `game_sessions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=559 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (532,'Equipo Verde','Verde',46,'2025-11-23 17:03:30.500349','2025-11-23 17:11:03.906846',178),(533,'Equipo Azul','Azul',45,'2025-11-23 17:03:30.555888','2025-11-23 17:11:22.927594',178),(534,'Equipo Rojo','Rojo',45,'2025-11-23 17:03:30.587886','2025-11-23 17:11:14.997870',178),(535,'Equipo Verde','Verde',30,'2025-11-23 17:24:38.936184','2025-11-23 18:05:57.876503',179),(536,'Equipo Azul','Azul',45,'2025-11-23 17:24:39.008187','2025-11-23 18:06:46.908105',179),(537,'Equipo Rojo','Rojo',45,'2025-11-23 17:24:39.055742','2025-11-23 18:06:23.628066',179),(538,'Equipo Verde','Verde',63,'2025-11-23 17:24:39.122756','2025-11-23 17:44:30.165293',180),(539,'Equipo Azul','Azul',59,'2025-11-23 17:24:39.156971','2025-11-23 17:45:05.144019',180),(540,'Equipo Rojo','Rojo',75,'2025-11-23 17:24:39.199970','2025-11-23 17:45:35.383323',180),(541,'Equipo Verde','Verde',30,'2025-11-23 18:18:25.038216','2025-11-23 18:29:27.594756',181),(542,'Equipo Azul','Azul',30,'2025-11-23 18:18:25.073325','2025-11-23 18:29:09.361141',181),(543,'Equipo Rojo','Rojo',30,'2025-11-23 18:18:25.107700','2025-11-23 18:28:53.679842',181),(544,'Equipo Verde','Verde',30,'2025-11-23 18:18:25.149828','2025-11-23 18:22:32.626722',182),(545,'Equipo Azul','Azul',30,'2025-11-23 18:18:25.181099','2025-11-23 18:23:00.570355',182),(546,'Equipo Rojo','Rojo',30,'2025-11-23 18:18:25.213008','2025-11-23 18:22:47.680928',182),(547,'Equipo Verde','Verde',0,'2025-11-23 18:37:05.512635','2025-11-23 18:37:05.512635',183),(548,'Equipo Azul','Azul',30,'2025-11-23 18:37:05.548632','2025-11-23 18:45:43.758776',183),(549,'Equipo Rojo','Rojo',0,'2025-11-23 18:37:05.585672','2025-11-23 18:37:05.585672',183),(550,'Equipo Verde','Verde',30,'2025-11-23 18:37:05.636347','2025-11-23 18:39:09.032789',184),(551,'Equipo Azul','Azul',30,'2025-11-23 18:37:05.670499','2025-11-23 18:38:57.533036',184),(552,'Equipo Rojo','Rojo',30,'2025-11-23 18:37:05.706158','2025-11-23 18:39:25.026710',184),(553,'Equipo Verde','Verde',0,'2025-11-23 18:46:36.915755','2025-11-23 18:46:36.915755',185),(554,'Equipo Azul','Azul',0,'2025-11-23 18:46:36.947501','2025-11-23 18:46:36.947501',185),(555,'Equipo Rojo','Rojo',0,'2025-11-23 18:46:36.979658','2025-11-23 18:46:36.980693',185),(556,'Equipo Verde','Verde',30,'2025-11-23 18:46:37.020773','2025-11-23 18:49:16.520685',186),(557,'Equipo Azul','Azul',30,'2025-11-23 18:46:37.051590','2025-11-23 18:49:31.614478',186),(558,'Equipo Rojo','Rojo',30,'2025-11-23 18:46:37.081765','2025-11-23 18:49:01.775634',186);
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_transactions`
--

DROP TABLE IF EXISTS `token_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` int NOT NULL,
  `source_type` varchar(30) NOT NULL,
  `source_id` int DEFAULT NULL,
  `reason` longtext,
  `created_at` datetime(6) NOT NULL,
  `awarded_by_id` bigint DEFAULT NULL,
  `game_session_id` bigint NOT NULL,
  `session_stage_id` bigint DEFAULT NULL,
  `team_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `token_trans_team_id_901680_idx` (`team_id`),
  KEY `token_trans_game_se_6b0306_idx` (`game_session_id`),
  KEY `token_trans_source__621a3e_idx` (`source_type`,`source_id`),
  KEY `token_trans_created_4c5cdd_idx` (`created_at`),
  KEY `token_transactions_awarded_by_id_115120a7_fk_professors_id` (`awarded_by_id`),
  KEY `token_transactions_session_stage_id_6212aa59_fk_session_s` (`session_stage_id`),
  CONSTRAINT `token_transactions_awarded_by_id_115120a7_fk_professors_id` FOREIGN KEY (`awarded_by_id`) REFERENCES `professors` (`id`),
  CONSTRAINT `token_transactions_game_session_id_6bfe21bc_fk_game_sessions_id` FOREIGN KEY (`game_session_id`) REFERENCES `game_sessions` (`id`),
  CONSTRAINT `token_transactions_session_stage_id_6212aa59_fk_session_s` FOREIGN KEY (`session_stage_id`) REFERENCES `session_stages` (`id`),
  CONSTRAINT `token_transactions_team_id_f387a4f1_fk_teams_id` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=996 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_transactions`
--

LOCK TABLES `token_transactions` WRITE;
/*!40000 ALTER TABLE `token_transactions` DISABLE KEYS */;
INSERT INTO `token_transactions` VALUES (924,15,'activity',2,'Actividad \"Presentación\": Presentación completada','2025-11-23 17:05:33.312587',NULL,178,372,533),(925,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) encontrada(s) en sopa de letras','2025-11-23 17:05:44.008146',NULL,178,372,534),(926,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) encontrada(s) en sopa de letras','2025-11-23 17:05:46.980287',NULL,178,372,534),(927,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) encontrada(s) en sopa de letras','2025-11-23 17:05:50.330207',NULL,178,372,534),(928,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) encontrada(s) en sopa de letras','2025-11-23 17:05:53.270942',NULL,178,372,534),(929,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) encontrada(s) en sopa de letras','2025-11-23 17:05:56.143938',NULL,178,372,534),(930,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) correcta(s) en anagrama','2025-11-23 17:06:00.967997',NULL,178,372,534),(931,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) correcta(s) en anagrama','2025-11-23 17:06:08.649118',NULL,178,372,534),(932,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) correcta(s) en anagrama','2025-11-23 17:06:14.944049',NULL,178,372,534),(933,15,'activity',2,'Actividad \"Presentación\": Presentación completada','2025-11-23 17:06:25.709722',NULL,178,372,532),(934,15,'activity',173,'Bubble Map: 15 burbujas (5 preguntas + 10 respuestas)','2025-11-23 17:08:36.342627',NULL,178,373,533),(935,22,'activity',174,'Bubble Map: 22 burbujas (5 preguntas + 17 respuestas)','2025-11-23 17:09:19.134502',NULL,178,373,534),(936,16,'activity',175,'Bubble Map: 16 burbujas (5 preguntas + 11 respuestas)','2025-11-23 17:09:48.066202',NULL,178,373,532),(937,15,'activity',2102,'Prototipo subido (15 tokens)','2025-11-23 17:11:03.900849',NULL,178,374,532),(938,15,'activity',2101,'Prototipo subido (15 tokens)','2025-11-23 17:11:14.982870',NULL,178,374,534),(939,15,'activity',2100,'Prototipo subido (15 tokens)','2025-11-23 17:11:22.911566',NULL,178,374,533),(940,15,'activity',2,'Actividad \"Presentación\": Presentación completada','2025-11-23 17:32:51.089568',NULL,180,376,540),(941,15,'activity',2,'Actividad \"Presentación\": Presentación completada','2025-11-23 17:32:55.644677',NULL,180,376,538),(942,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) encontrada(s) en sopa de letras','2025-11-23 17:33:01.400860',NULL,180,376,539),(943,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) encontrada(s) en sopa de letras','2025-11-23 17:33:19.173884',NULL,180,376,539),(944,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) encontrada(s) en sopa de letras','2025-11-23 17:33:20.991005',NULL,180,376,539),(945,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) encontrada(s) en sopa de letras','2025-11-23 17:33:23.877456',NULL,180,376,539),(946,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) encontrada(s) en sopa de letras','2025-11-23 17:33:26.194912',NULL,180,376,539),(947,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) correcta(s) en anagrama','2025-11-23 17:33:29.735131',NULL,180,376,539),(948,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) correcta(s) en anagrama','2025-11-23 17:33:36.204357',NULL,180,376,539),(949,1,'activity',2,'Actividad \"Presentación\": +1 palabra(s) correcta(s) en anagrama','2025-11-23 17:33:42.014134',NULL,180,376,539),(950,18,'activity',176,'Bubble Map: 18 burbujas (5 preguntas + 13 respuestas)','2025-11-23 17:35:24.886501',NULL,180,377,539),(951,15,'activity',178,'Bubble Map: 15 burbujas (5 preguntas + 10 respuestas)','2025-11-23 17:37:59.289722',NULL,180,377,538),(952,15,'activity',177,'Bubble Map: 15 burbujas (5 preguntas + 10 respuestas)','2025-11-23 17:38:55.214640',NULL,180,377,540),(953,15,'activity',2123,'Prototipo subido (15 tokens)','2025-11-23 17:39:30.067144',NULL,180,378,538),(954,15,'activity',2122,'Prototipo subido (15 tokens)','2025-11-23 17:39:41.096318',NULL,180,378,540),(955,15,'activity',2121,'Prototipo subido (15 tokens)','2025-11-23 17:40:05.989676',NULL,180,378,539),(956,15,'peer_evaluation',271,'Evaluación peer: Equipo Azul → Equipo Verde','2025-11-23 17:41:48.819484',NULL,180,379,538),(957,3,'peer_evaluation',272,'Evaluación peer: Equipo Rojo → Equipo Verde','2025-11-23 17:44:30.160297',NULL,180,379,538),(958,15,'peer_evaluation',273,'Evaluación peer: Equipo Verde → Equipo Azul','2025-11-23 17:45:02.618967',NULL,180,379,539),(959,3,'peer_evaluation',274,'Evaluación peer: Equipo Rojo → Equipo Azul','2025-11-23 17:45:05.137042',NULL,180,379,539),(960,15,'peer_evaluation',275,'Evaluación peer: Equipo Azul → Equipo Rojo','2025-11-23 17:45:28.012114',NULL,180,379,540),(961,15,'peer_evaluation',276,'Evaluación peer: Equipo Verde → Equipo Rojo','2025-11-23 17:45:35.377359',NULL,180,379,540),(962,15,'activity',2,'Actividad \"Presentación\": Presentación completada','2025-11-23 17:56:37.396316',NULL,179,380,536),(963,15,'activity',2,'Actividad \"Presentación\": Presentación completada','2025-11-23 17:56:40.501527',NULL,179,380,537),(964,15,'peer_evaluation',277,'Evaluación peer: Equipo Azul → Equipo Verde','2025-11-23 18:05:53.876494',NULL,179,383,535),(965,15,'peer_evaluation',278,'Evaluación peer: Equipo Rojo → Equipo Verde','2025-11-23 18:05:57.872501',NULL,179,383,535),(966,15,'peer_evaluation',279,'Evaluación peer: Equipo Verde → Equipo Rojo','2025-11-23 18:06:19.000704',NULL,179,383,537),(967,15,'peer_evaluation',280,'Evaluación peer: Equipo Azul → Equipo Rojo','2025-11-23 18:06:23.623068',NULL,179,383,537),(968,15,'peer_evaluation',281,'Evaluación peer: Equipo Verde → Equipo Azul','2025-11-23 18:06:34.837640',NULL,179,383,536),(969,15,'peer_evaluation',282,'Evaluación peer: Equipo Rojo → Equipo Azul','2025-11-23 18:06:46.896054',NULL,179,383,536),(970,15,'peer_evaluation',283,'Evaluación peer: Equipo Rojo → Equipo Verde','2025-11-23 18:22:24.778175',NULL,182,387,544),(971,15,'peer_evaluation',284,'Evaluación peer: Equipo Azul → Equipo Verde','2025-11-23 18:22:32.619724',NULL,182,387,544),(972,15,'peer_evaluation',285,'Evaluación peer: Equipo Verde → Equipo Rojo','2025-11-23 18:22:45.334573',NULL,182,387,546),(973,15,'peer_evaluation',286,'Evaluación peer: Equipo Azul → Equipo Rojo','2025-11-23 18:22:47.677965',NULL,182,387,546),(974,15,'peer_evaluation',287,'Evaluación peer: Equipo Verde → Equipo Azul','2025-11-23 18:22:58.182025',NULL,182,387,545),(975,15,'peer_evaluation',288,'Evaluación peer: Equipo Rojo → Equipo Azul','2025-11-23 18:23:00.567391',NULL,182,387,545),(976,15,'peer_evaluation',289,'Evaluación peer: Equipo Verde → Equipo Rojo','2025-11-23 18:28:39.327360',NULL,181,391,543),(977,15,'peer_evaluation',290,'Evaluación peer: Equipo Azul → Equipo Rojo','2025-11-23 18:28:53.675843',NULL,181,391,543),(978,15,'peer_evaluation',291,'Evaluación peer: Equipo Verde → Equipo Azul','2025-11-23 18:29:03.937889',NULL,181,391,542),(979,15,'peer_evaluation',292,'Evaluación peer: Equipo Rojo → Equipo Azul','2025-11-23 18:29:09.358091',NULL,181,391,542),(980,15,'peer_evaluation',293,'Evaluación peer: Equipo Rojo → Equipo Verde','2025-11-23 18:29:24.813468',NULL,181,391,541),(981,15,'peer_evaluation',294,'Evaluación peer: Equipo Azul → Equipo Verde','2025-11-23 18:29:27.591756',NULL,181,391,541),(982,15,'peer_evaluation',295,'Evaluación peer: Equipo Rojo → Equipo Azul','2025-11-23 18:38:54.589199',NULL,184,395,551),(983,15,'peer_evaluation',296,'Evaluación peer: Equipo Verde → Equipo Azul','2025-11-23 18:38:57.528036',NULL,184,395,551),(984,15,'peer_evaluation',297,'Evaluación peer: Equipo Azul → Equipo Verde','2025-11-23 18:39:06.537848',NULL,184,395,550),(985,15,'peer_evaluation',298,'Evaluación peer: Equipo Rojo → Equipo Verde','2025-11-23 18:39:09.029792',NULL,184,395,550),(986,15,'peer_evaluation',299,'Evaluación peer: Equipo Azul → Equipo Rojo','2025-11-23 18:39:22.785245',NULL,184,395,552),(987,15,'peer_evaluation',300,'Evaluación peer: Equipo Verde → Equipo Rojo','2025-11-23 18:39:25.023708',NULL,184,395,552),(988,15,'peer_evaluation',301,'Evaluación peer: Equipo Rojo → Equipo Azul','2025-11-23 18:45:39.586376',NULL,183,399,548),(989,15,'peer_evaluation',302,'Evaluación peer: Equipo Verde → Equipo Azul','2025-11-23 18:45:43.754774',NULL,183,399,548),(990,15,'peer_evaluation',303,'Evaluación peer: Equipo Azul → Equipo Rojo','2025-11-23 18:48:57.355557',NULL,186,403,558),(991,15,'peer_evaluation',304,'Evaluación peer: Equipo Verde → Equipo Rojo','2025-11-23 18:49:01.772641',NULL,186,403,558),(992,15,'peer_evaluation',305,'Evaluación peer: Equipo Azul → Equipo Verde','2025-11-23 18:49:11.777436',NULL,186,403,556),(993,15,'peer_evaluation',306,'Evaluación peer: Equipo Rojo → Equipo Verde','2025-11-23 18:49:16.516724',NULL,186,403,556),(994,15,'peer_evaluation',307,'Evaluación peer: Equipo Verde → Equipo Azul','2025-11-23 18:49:28.768606',NULL,186,403,557),(995,15,'peer_evaluation',308,'Evaluación peer: Equipo Rojo → Equipo Azul','2025-11-23 18:49:31.610515',NULL,186,403,557);
/*!40000 ALTER TABLE `token_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topics`
--

DROP TABLE IF EXISTS `topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topics` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` longtext,
  `image_url` varchar(500) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `icon` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `topics_is_acti_45fe00_idx` (`is_active`),
  KEY `topics_categor_7de43b_idx` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topics`
--

LOCK TABLES `topics` WRITE;
/*!40000 ALTER TABLE `topics` DISABLE KEYS */;
INSERT INTO `topics` VALUES (1,'Salud','Temas relacionados con salud, bienestar y calidad de vida',NULL,'health',1,'2025-11-04 23:30:45.694000','2025-11-06 18:30:01.831000','?'),(2,'Educación','Temas relacionados con educación, formación y desarrollo de habilidades',NULL,'education',1,'2025-11-04 23:30:45.741000','2025-11-06 18:30:01.835000','?'),(3,'Sustentabilidad','Temas relacionados con sostenibilidad, medio ambiente y recursos naturales',NULL,'sustainability',1,'2025-11-04 23:30:45.775000','2025-11-06 18:30:01.835000','?');
/*!40000 ALTER TABLE `topics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topics_faculties`
--

DROP TABLE IF EXISTS `topics_faculties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topics_faculties` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `topic_id` bigint NOT NULL,
  `faculty_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `topics_faculties_topic_id_faculty_id_1e55427d_uniq` (`topic_id`,`faculty_id`),
  KEY `topics_faculties_faculty_id_c3ce4990_fk_faculties_id` (`faculty_id`),
  CONSTRAINT `topics_faculties_faculty_id_c3ce4990_fk_faculties_id` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`id`),
  CONSTRAINT `topics_faculties_topic_id_b46cd624_fk_topics_id` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topics_faculties`
--

LOCK TABLES `topics_faculties` WRITE;
/*!40000 ALTER TABLE `topics_faculties` DISABLE KEYS */;
INSERT INTO `topics_faculties` VALUES (1,1,1),(2,2,1),(3,3,1);
/*!40000 ALTER TABLE `topics_faculties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `word_search_options`
--

DROP TABLE IF EXISTS `word_search_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `word_search_options` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `words` json NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `activity_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `word_search_activit_21d157_idx` (`activity_id`,`is_active`),
  CONSTRAINT `word_search_options_activity_id_0d3f5a64_fk_activities_id` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `word_search_options`
--

LOCK TABLES `word_search_options` WRITE;
/*!40000 ALTER TABLE `word_search_options` DISABLE KEYS */;
/*!40000 ALTER TABLE `word_search_options` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-23 16:06:14
