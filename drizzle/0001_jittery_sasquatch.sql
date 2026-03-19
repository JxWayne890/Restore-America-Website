CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`type` enum('inspection','estimate','job_start','follow_up') DEFAULT 'inspection',
	`status` enum('scheduled','confirmed','completed','cancelled','no_show') DEFAULT 'scheduled',
	`scheduledAt` timestamp NOT NULL,
	`durationMinutes` int DEFAULT 60,
	`address` text,
	`assignedTo` varchar(255),
	`notes` text,
	`reminderSent` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `automation_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`sequenceId` int NOT NULL,
	`currentStep` int DEFAULT 0,
	`status` enum('active','completed','paused','cancelled') DEFAULT 'active',
	`nextRunAt` timestamp,
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `automation_enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `automation_sequences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`trigger` enum('new_lead','inspection_scheduled','estimate_sent','claim_denied','no_response_3d','no_response_7d') NOT NULL,
	`isActive` boolean DEFAULT true,
	`steps` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `automation_sequences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`visitorName` varchar(255),
	`visitorPhone` varchar(30),
	`visitorEmail` varchar(320),
	`leadId` int,
	`status` enum('active','converted','closed') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `chat_sessions_sessionId_unique` UNIQUE(`sessionId`)
);
--> statement-breakpoint
CREATE TABLE `lead_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`type` enum('note','call','sms','email','stage_change','inspection','estimate','system') NOT NULL,
	`content` text NOT NULL,
	`createdBy` varchar(255) DEFAULT 'system',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lead_activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`email` varchar(320),
	`address` text,
	`city` varchar(100),
	`state` varchar(50),
	`zip` varchar(20),
	`damageType` enum('hail','wind','fire','flood','tree','roof','other') NOT NULL,
	`isOwner` boolean DEFAULT true,
	`claimStatus` enum('not_filed','open','denied','paid') DEFAULT 'not_filed',
	`insuranceCompany` varchar(255),
	`estimatedValue` decimal(10,2),
	`notes` text,
	`stage` enum('new','contacted','inspection_scheduled','inspection_done','estimate_sent','claim_filed','approved','in_progress','completed','lost') NOT NULL DEFAULT 'new',
	`source` enum('website','facebook','google','referral','storm_canvass','other') DEFAULT 'website',
	`utmSource` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(100),
	`assignedTo` varchar(255),
	`isHot` boolean DEFAULT false,
	`isArchived` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastContactedAt` timestamp,
	`closedAt` timestamp,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform` enum('google','facebook','other') DEFAULT 'google',
	`reviewerName` varchar(255) NOT NULL,
	`rating` int NOT NULL,
	`content` text,
	`reviewDate` timestamp,
	`isFeatured` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `storm_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`affectedAreas` text NOT NULL,
	`severity` enum('watch','warning','emergency') DEFAULT 'warning',
	`isActive` boolean DEFAULT false,
	`activatedAt` timestamp,
	`deactivatedAt` timestamp,
	`createdBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `storm_alerts_id` PRIMARY KEY(`id`)
);
