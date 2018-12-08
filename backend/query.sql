-- subquery where all comment score of product must be more than 3 and name include Horn
SELECT *
FROM QUERY_TABLE
WHERE PID NOT IN(
	SELECT REVIEW_PID FROM REVIEWS
	WHERE SCORE BETWEEN 1 AND 3
) and PNAME LIKE "%Horn%"
order by products.pid;


-- search by product name --
SELECT *
FROM QUERY_TABLE
WHERE PNAME LIKE "%keyword%";

-- serach by product name within categories --
SELECT *
FROM QUERY_TABLE
WHERE PNAME LIKE "%keyword%"
	AND (CAT_TITLE LIKE "%category1%" OR CAT_TITLE LIKE "%category2%");

-- search by product id --
SELECT *
FROM QUERY_TABLE
WHERE PID = 1;

-- search by manufacturer name --
SELECT *
FROM QUERY_TABLE
WHERE MANUFACTURER_NAME LIKE "%keyword%";

-- serach by manufacturer name within categories --
SELECT *
FROM QUERY_TABLE
WHERE MANUFACTURER_NAME LIKE "%keyword%"
	AND (CAT_TITLE LIKE "%category1%" OR CAT_TITLE LIKE "%category2%");
