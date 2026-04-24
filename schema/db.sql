CREATE DATABASE twitter;
use twitter;

-- SET GLOBAL TIME 
set GLOBAL time_zone = "+00:00";
select @@GLOBAL.time_zone, @@session.time_zone;

-- USER TABLE
create table users(
user_id bigint primary key auto_increment,
fullname varchar(100),
username varchar(50) unique,
email varchar(255) unique,
dob date not null,
hashed_password varchar(255),
bio text,
country varchar(50) not null,
profile_pic varchar(255),
cover_pic varchar(255),
created_at timestamp default current_timestamp
);

--tweet table
create table tweets(
tweet_id bigint primary key auto_increment,
user_id bigint not null,
content text,
created_at timestamp default current_timestamp,
foreign key  (user_id) references users(user_id) on delete cascade
);

create table tweet_media(
media_id bigint auto_increment primary key,
tweet_id bigint,
media_type varchar(100) not null,
media_url varchar(255) not null,
foreign key (tweet_id) references tweets(tweet_id) on delete cascade
);

create table follows(
follower_id bigint not null,
followee_id bigint not null,
created_at timestamp default current_timestamp,
primary key(follower_id,followee_id), 
foreign key (follower_id) references users(user_id) on delete cascade,
foreign key (followee_id) references users(user_id) on delete cascade
);

create table retweet(
user_id bigint not null,
tweet_id bigint not null,
created_at timestamp default current_timestamp,
primary key(user_id,tweet_id),
foreign key (user_id) references users(user_id) on delete cascade,
foreign key (tweet_id) references tweets(tweet_id) on delete cascade
);

create table reaction(
user_id bigint not null, 
tweet_id bigint not null,
isLiked boolean default true,
created_at timestamp default current_timestamp,
primary key(user_id,tweet_id),
foreign key(user_id) references users(user_id) on delete cascade,
foreign key(tweet_id) references tweets(tweet_id) on delete cascade
);

create table comments(
comment_id bigint auto_increment primary key,
tweet_id bigint,
user_id bigint,
comment_content text,
parent_comment_id bigint ,	
created_at timestamp default current_timestamp,
foreign key(tweet_id) references tweets(tweet_id) on delete cascade,
foreign key (user_id) references users(user_id) on delete cascade,
foreign key (parent_comment_id) references comments(comment_id) on delete set null
);

create table comment_reaction(
comment_id bigint,
user_id bigint,
isLiked boolean default true,
created_at timestamp default current_timestamp,
primary key(user_id,comment_id),
foreign key(comment_id) references comments(comment_id) on delete cascade,
foreign key(user_id) references users(user_id) on delete cascade
);

create table notification(
notification_id bigint primary key auto_increment,
user_id bigint not null,    -- receptant
actor_id bigint not null,     -- who triggered the event
tweet_id bigint ,
comment_id bigint ,
notification_type varchar(50) not null,
is_read boolean default false,
created_at timestamp default current_timestamp,
foreign key (user_id) references users(user_id) on delete cascade,
foreign key(actor_id) references users(user_id) on delete cascade,
foreign key(tweet_id) references tweets(tweet_id) on delete set null,
foreign key(comment_id) references comments(comment_id) on delete set null
);

