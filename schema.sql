create table if not exists `user` (
  `id` varchar(36) not null,
  `name` varchar(255) not null,
  `email` varchar(255) not null unique,
  `emailVerified` boolean not null default false,
  `image` text,
  `createdAt` timestamp not null default current_timestamp,
  `updatedAt` timestamp not null default current_timestamp on update current_timestamp,
  `twoFactorEnabled` tinyint(1) not null default 0,
  primary key (`id`)
);

create table if not exists `session` (
  `id` varchar(36) not null,
  `expiresAt` timestamp not null,
  `token` varchar(255) not null unique,
  `createdAt` timestamp not null default current_timestamp,
  `updatedAt` timestamp not null default current_timestamp on update current_timestamp,
  `ipAddress` varchar(45),
  `userAgent` text,
  `userId` varchar(36) not null,
  primary key (`id`),
  key `idx_session_userId` (`userId`),
  key `idx_session_token` (`token`),
  constraint `fk_session_user` foreign key (`userId`) references `user` (`id`) on delete cascade
);

create table if not exists `account` (
  `id` varchar(36) not null,
  `accountId` varchar(255) not null,
  `providerId` varchar(255) not null,
  `userId` varchar(36) not null,
  `accessToken` text,
  `refreshToken` text,
  `idToken` text,
  `accessTokenExpiresAt` timestamp NULL,
  `refreshTokenExpiresAt` timestamp NULL,
  `scope` text,
  `password` varchar(255),
  `createdAt` timestamp not null default current_timestamp,
  `updatedAt` timestamp not null default current_timestamp on update current_timestamp,
  primary key (`id`),
  key `idx_account_userId` (`userId`),
  unique key `idx_account_provider` (`providerId`, `accountId`),
  constraint `fk_account_user` foreign key (`userId`) references `user` (`id`) on delete cascade
);

create table if not exists `verification` (
  `id` varchar(36) not null,
  `identifier` varchar(255) not null,
  `value` varchar(255) not null,
  `expiresAt` timestamp not null,
  `createdAt` timestamp not null default current_timestamp,
  `updatedAt` timestamp not null default current_timestamp on update current_timestamp,
  PRIMARY KEY (`id`),
  KEY `idx_verification_identifier` (`identifier`)
);

create table if not exists `jwks` (
  `id` varchar(36) not null,
  `publicKey` text not null,
  `privateKey` text not null,
  `createdAt` timestamp not null default current_timestamp,
  primary key (`id`)
);

create table if not exists `twoFactor` (
  `id` varchar(36) not null,
  `secret` varchar(255) not null,
  `backupCodes` text not null,
  `userId` varchar(36) not null,
  `createdAt` timestamp not null default current_timestamp,
  `updatedAt` timestamp not null default current_timestamp on update current_timestamp,
  primary key (`id`),
  key `idx_twoFactor_userId` (`userId`),
  constraint `fk_twoFactor_user` foreign key (`userId`) references `user` (`id`) on delete cascade
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;

create table if not exists `passkey` (
  `id` varchar(36) not null,
  `name` varchar(255),
  `publicKey` text not null,
  `userId` varchar(36) not null,
  `credentialID` varchar(255) not null,
  `counter` int not null,
  `deviceType` varchar(255) not null,
  `backedUp` tinyint(1) not null,
  `transports` text,
  `createdAt` timestamp not null default current_timestamp,
  `aaguid` varchar(255),
  primary key (`id`),
  key `idx_passkey_userId` (`userId`),
  constraint `fk_passkey_user` foreign key (`userId`) references `user` (`id`) on delete cascade
) engine=innodb default charset=utf8mb4 collate=utf8mb4_0900_ai_ci;