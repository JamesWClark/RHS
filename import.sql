-- used in MS access to join xlsx from LifeTouch and from Core

SELECT Core.[User ID] AS user_id, LT.[Image Name] AS filename
FROM Core INNER JOIN LT ON Core.[Student ID] = LT.[Student ID];

-- LT Headers
-- Student ID	Image Name	First Name	Grade	Last Name	Patron #	External Student ID

-- Core Headers
-- User ID	Student ID	First Name	Nickname	Last Name	Grad Year	E-Mail
