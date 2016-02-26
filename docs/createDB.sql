CREATE DATABASE windup;
GRANT ALL ON windup.* TO windup@'%' IDENTIFIED BY 'windup';
GRANT ALL ON windup.* TO windup@localhost IDENTIFIED BY 'windup';
FLUSH PRIVILEGES;
