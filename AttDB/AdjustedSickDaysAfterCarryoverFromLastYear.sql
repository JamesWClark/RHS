SELECT [last name], [first name], [ADP Number], [Personal-Full-Day] + 0.5 * [Personal-Half-Day] AS [Used-Personal], [Sick-Full-Day] + 0.5 * [Sick-Half-Day] AS [Used-Sick], [Vacation-Full-Day] + 0.5 * [Vacation-Half-Day] AS [Used-Vacation], 3 - ([Personal-Full-Day] + 0.5 * [Personal-Half-Day]) AS [Remaining-Personal], 10 - ([Sick-Full-Day] + 0.5 * [Sick-Half-Day]) AS [Remaining-Sick]
FROM (SELECT rhs.[Last Name], rhs.[First Name], rhs.[ADP Number], 
        IIF(IsNull(Personal.[Personal Days]),0,Personal.[Personal Days]) AS [Personal-Full-Day], 
        IIF(IsNull(HalfPersonal.[Half Personal Days]),0,HalfPersonal.[Half Personal Days]) AS [Personal-Half-Day], 
        IIF(IsNull(Illness.[Sick Days]),0,Illness.[Sick Days]) AS [Sick-Full-Day], 
        IIF(IsNull(HalfIllness.[Half Sick Days]),0,HalfIllness.[Half Sick Days]) AS [Sick-Half-Day], 
        IIF(IsNull(Vacation.[Vacation Days]),0,Vacation.[Vacation Days]) AS [Vacation-Full-Day], 
        IIF(IsNull(HalfVacation.[Half Vacation Days]),0,HalfVacation.[Half Vacation Days]) AS [Vacation-Half-Day] 
FROM ((((([rhs faculty] AS rhs 
        LEFT JOIN (
                SELECT [import id], COUNT(code) AS [Personal Days] 
                FROM attendance 
                WHERE (hours >= 7 AND code = "Childcare Issues") OR (hours >= 7 AND code = "Personal") 
                GROUP BY [import id])  AS Personal ON Personal.[import id] = rhs.[import id]) 
                        LEFT JOIN (SELECT [import id], COUNT(code) AS [Half Personal Days] 
                                FROM attendance 
                                WHERE (hours < 7 AND hours >= 3.5 AND code = "Childcare Issues") OR (hours < 7 AND hours >= 3.5 AND code = "Personal") 
                                GROUP BY [import id])  AS HalfPersonal ON HalfPersonal.[import id] = rhs.[import id]) 
                                        LEFT JOIN (SELECT [import id], COUNT(code) AS [Sick Days] 
                                                FROM attendance 
                                                WHERE (hours >= 7 AND code = "Doctor's Appointment") OR (hours >= 7 AND code = "Illness") OR (hours >= 7 AND code = "Illness (Child)") OR (hours >= 7 AND code = "Illness (Family)") 
                                                GROUP BY [import id])  AS Illness ON Illness.[import id] = rhs.[import id]) 
                                                        LEFT JOIN (SELECT [import id], COUNT(code) AS [Half Sick Days] 
                                                                FROM attendance 
                                                                WHERE (hours < 7 AND hours >= 3.5 AND code = "Doctor's Appointment") OR (hours < 7 AND hours >= 3.5 AND code = "Illness") OR (hours < 7 AND hours >= 3.5 AND code = "Illness (Child)") OR (hours < 7 AND hours >= 3.5 AND code = "Illness (Family)") 
                                                                GROUP BY [import id])  AS HalfIllness ON HalfIllness.[import id] = rhs.[import id]) 
                                                                        LEFT JOIN (SELECT [import id], COUNT(code) AS [Vacation Days] 
                                                                                FROM attendance 
                                                                                WHERE (hours >= 7 AND code = "Vacation") 
                                                                                GROUP BY [import id])  AS Vacation ON Vacation.[import id] = rhs.[import id]) 
                                                                                        LEFT JOIN (SELECT [import id], COUNT(code) AS [Half Vacation Days] 
                                                                                                FROM attendance         
                                                                                                WHERE (hours < 7 AND hours >= 3.5 AND code = "Vacation")
                                                                                                GROUP BY [import id])  AS HalfVacation ON HalfVacation.[import id] = rhs.[import id] ORDER BY rhs.[last name])  AS outside;