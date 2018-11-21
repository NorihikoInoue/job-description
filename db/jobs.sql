/****** Object:  Table [guest].[jobs]    Script Date: 2018/11/21 11:31:14 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [guest].[jobs](
	[period] [nvarchar](32) NOT NULL,
	[area] [nvarchar](32) NOT NULL,
	[job] [text] NOT NULL,
	[language] [nvarchar](128) NULL,
	[output] [nvarchar](128) NULL,
	[role] [nvarchar](128) NULL,
	[description] [nvarchar](max) NULL,
 CONSTRAINT [pk_jobs] PRIMARY KEY CLUSTERED 
(
	[period] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

