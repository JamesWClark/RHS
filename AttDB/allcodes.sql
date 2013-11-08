SELECT [Departmental].[last name], [Departmental].[first name], [Departmental].[adp number], [Departmental].[import id], [Childcare Issues].[Childcare Issues], [Doctor Appointment].[Doctor Appointment]
FROM (((
	(SELECT f.[last name], f.[first name], f.[ADP Number], f.[import id], SUM(hours) as [Childcare Issues] FROM [RHS Faculty] as f LEFT JOIN [Attendance] as a ON f.[import id] = a.[import id] WHERE code = 'Childcare Issues' GROUP BY f.[ADP Number], f.[last name], f.[first name], f.[import id])
	AS [Childcare Issues]
	LEFT JOIN
	(
		SELECT f.[last name], f.[first name], f.[ADP Number], f.[import id], SUM(hours) as [Comp Day] FROM [RHS Faculty] as f LEFT JOIN [Attendance] as a ON f.[import id] = a.[import id] WHERE code = 'Comp Day' GROUP BY f.[ADP Number], f.[last name], f.[first name], f.[import id]
	) AS [Comp Day]
	ON [Childcare Issues].[import id] = [Comp Day].[import id])
	LEFT JOIN
	(
		SELECT f.[last name], f.[first name], f.[ADP Number], f.[import id], SUM(hours) as [Departmental] FROM [RHS Faculty] as f LEFT JOIN [Attendance] as a ON f.[import id] = a.[import id] WHERE code = 'Departmental ' GROUP BY f.[ADP Number], f.[last name], f.[first name], f.[import id]
	) AS [Departmental]
	ON [Comp Day].[import id] = [Departmental].[import id])
	LEFT JOIN
	(
		SELECT f.[last name], f.[first name], f.[ADP Number], f.[import id], SUM(hours) as [Doctor Appointment] FROM [RHS Faculty] as f LEFT JOIN [Attendance] as a ON f.[import id] = a.[import id] WHERE code = 'Doctor Appointment' GROUP BY f.[ADP Number], f.[last name], f.[first name], f.[import id]
	) AS [Doctor Appointment]
	ON [Departmental].[import id] = [Doctor Appointment].[import id])
