

CREATE DATABASE amazon;
ALTER DATABASE 	amazon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE amazon;

create table if not exists manufacturer(
	manu_id int not null primary key ,
  manufacturer_name TEXT
);

LOAD DATA INFILE '/Users/prethrolic/github/shopping-database/backend/src/manufacturer.csv'
INTO TABLE manufacturer
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;


create table if not exists products(
	pid 			int 	not null 		primary key,
  pname 		VARCHAR(255) not null,
  product_manu 		int,
  price   	float 	not null,
  name_in_stock 					LONGTEXT 		not null,
  number_of_reviews 			INT,
  average_review_rating 	float,
  description LONGTEXT,
 	product_subcat int,
  product_cat		int,

  foreign key(product_manu) references manufacturer(manu_id)
  on delete cascade on update cascade

);


LOAD DATA INFILE '/Users/prethrolic/github/shopping-database/backend/src/dataset.csv'
INTO TABLE products
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;


create table if not exists category(
		catid int not null primary key,
    cat_title LONGTEXT not null
);

LOAD DATA INFILE '/Users/prethrolic/github/shopping-database/backend/src/category.csv'
INTO TABLE category
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

create table if not exists subcategory(
		subcatid int not null primary key,
    parent_id int,
    subcat_title LONGTEXT not null,

    foreign key(parent_id) references category(catid)
    on delete cascade on update cascade
);


LOAD DATA INFILE '/Users/prethrolic/github/shopping-database/backend/src/subcategory.csv'
INTO TABLE subcategory
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

create table if not exists reviews(

		rid int primary key AUTO_INCREMENT,
    review_pid int,
    score int,
    info LONGTEXT

);

LOAD DATA INFILE '/Users/prethrolic/github/shopping-database/backend/src/reviews.csv'
INTO TABLE reviews
CHARACTER SET latin1
FIELDS TERMINATED BY ','
ENCLOSED BY '!'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- trigger to reset all AVG_rating after insert reviews
DELIMITER $$
create trigger average_rating_trigger after insert on reviews
for each row
begin
update PRODUCTS inner join (select  PRODUCTS.pid,ROUND(SUM( reviews.score ) / COUNT(reviews.review_pid),1) as newScore from PRODUCTS join reviews
on reviews.review_pid = PRODUCTS.pid
where reviews.review_pid = PRODUCTS.pid group by PRODUCTS.pid) as A
on A.pid = PRODUCTS.pid
set average_review_rating = newScore
where PRODUCTS.pid is not null;

END$$
DELIMITER ;


-- trigger to reset all number of column after insert reviews
DELIMITER $$
create trigger number_comment_trigger after insert on reviews
for each row
begin
	update PRODUCTS inner join (select  PRODUCTS.pid,ROUND( COUNT(reviews.review_pid),1) as newreviewCount from PRODUCTS join reviews
	on reviews.review_pid = PRODUCTS.pid
	where reviews.review_pid = PRODUCTS.pid group by PRODUCTS.pid ) as A
	on A.pid = PRODUCTS.pid
	set number_of_reviews = newreviewCount
	where PRODUCTS.pid is not null;

END$$
DELIMITER ;

CREATE VIEW QUERY_TABLE AS
SELECT pid, pname, price, description, average_review_rating, cat_title, subcat_title, manufacturer_name
FROM PRODUCTS
	JOIN CATEGORY ON catid = product_cat
	JOIN SUBCATEGORY ON subcatid = product_subcat
	JOIN MANUFACTURER ON manu_id = product_manu;
