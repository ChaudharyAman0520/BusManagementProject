-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: bus_management
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--
DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(10) NOT NULL,
  `bus_id` varchar(10) NOT NULL,
  `location` varchar(100) NOT NULL,
  `seat_id` varchar(10) NOT NULL,
  `booking_time` datetime NOT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `seat_id` (`seat_id`,`bus_id`,`location`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`seat_id`, `bus_id`, `location`) REFERENCES `seats` (`seat_id`, `bus_id`, `location`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (34,'S101','B2','Selaqui','1A','2025-05-15 15:41:06');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buses`
--

DROP TABLE IF EXISTS `buses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buses` (
  `bus_id` varchar(10) NOT NULL,
  `location` varchar(100) NOT NULL,
  PRIMARY KEY (`bus_id`,`location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buses`
--

LOCK TABLES `buses` WRITE;
/*!40000 ALTER TABLE `buses` DISABLE KEYS */;
INSERT INTO `buses` VALUES ('B2','Selaqui'),('B3','Rajpur Road'),('B4','Selaqui');
/*!40000 ALTER TABLE `buses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `seat_id` varchar(10) NOT NULL,
  `bus_id` varchar(10) NOT NULL,
  `location` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'available',
  PRIMARY KEY (`seat_id`,`bus_id`,`location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES ('1A','B2','Selaqui','filled'),('1A','B3','Rajpur Road','available'),('1A','B4','Selaqui','available'),('1B','B2','Selaqui','available'),('1B','B3','Rajpur Road','available'),('1B','B4','Selaqui','available'),('1C','B2','Selaqui','available'),('1C','B3','Rajpur Road','available'),('1C','B4','Selaqui','available'),('1D','B2','Selaqui','available'),('1D','B3','Rajpur Road','available'),('1D','B4','Selaqui','available'),('1E','B2','Selaqui','available'),('1E','B3','Rajpur Road','available'),('1E','B4','Selaqui','available'),('2A','B2','Selaqui','available'),('2A','B3','Rajpur Road','available'),('2A','B4','Selaqui','available'),('2B','B2','Selaqui','available'),('2B','B3','Rajpur Road','available'),('2B','B4','Selaqui','available'),('2C','B2','Selaqui','available'),('2C','B3','Rajpur Road','available'),('2C','B4','Selaqui','available'),('2D','B2','Selaqui','available'),('2D','B3','Rajpur Road','available'),('2D','B4','Selaqui','available'),('2E','B2','Selaqui','available'),('2E','B3','Rajpur Road','available'),('2E','B4','Selaqui','available');
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES ('23011346','Aman Chaudhary','Aman@123'),('S101','Amit Kumar','pass123'),('S102','Riya Sharma','pass456'),('S103','Neha Verma','pass789'),('S104','Raj Singh','raj123'),('S105','Tina Das','tina456'),('S106','Arjun Mehta','mehta789'),('S107','Priya Jain','priya001'),('S108','Manish Roy','roy321'),('S109','Sneha Kapoor','sneha456'),('S110','Karan Malhotra','karan789');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-15 19:18:55
