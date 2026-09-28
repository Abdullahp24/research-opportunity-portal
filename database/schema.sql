-- Research Opportunity Portal Database Schema
-- For MySQL / MariaDB (XAMPP)

CREATE DATABASE IF NOT EXISTS research_portal;
USE research_portal;

CREATE TABLE IF NOT EXISTS opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    research_area VARCHAR(255) NOT NULL,
    required_skills VARCHAR(255),
    available_positions INT DEFAULT 1,
    application_deadline DATE,
    status ENUM('Open', 'Closed') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);