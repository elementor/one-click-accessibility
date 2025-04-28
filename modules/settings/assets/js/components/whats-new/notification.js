import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Chip from '@elementor/ui/Chip';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';

const StyledContainer = styled(Box)`
	margin: ${({ theme }) => theme.spacing(3)} 0;

	&:first-of-type {
		margin: 0;
	}

	&:last-of-type {
		margin-bottom: 0;
	}
`;

const StyledSubHeading = styled(Typography)`
	color: ${({ theme }) => theme.palette.text.tertiary};
	font-size: 12px;
	line-height: 166%;
	letter-spacing: 0.4px;
`;

const StyledHeading = styled(Typography)`
	margin-top: ${({ theme }) => theme.spacing(1)};

	color: ${({ theme }) => theme.palette.text.primary};

	font-style: normal;
	font-size: 16px;
	font-weight: 400;
	letter-spacing: 0.15px;
`;

const StyledImage = styled('img')`
	height: 162px;
	width: 100%;
	margin-bottom: ${({ theme }) => theme.spacing(1)};

	object-fit: cover;
	text-align: center;
`;

const StyledChip = styled(Chip)`
	margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledLearnMoreLink = styled(Button)`
	display: inline;
	padding: 0;

	line-height: 143%;
	letter-spacing: 0.17px;
	vertical-align: baseline;
`;

const StyledCtaLink = styled(Button)`
	margin-top: ${({ theme }) => theme.spacing(2)};
`;

const WhatsNewNotification = ({
	topic,
	title,
	imageSrc,
	description,
	readMoreText,
	link,
	cta,
	ctaLink,
	chipTags,
}) => {
	return (
		<StyledContainer>
			<StyledSubHeading variant="caption">{topic}</StyledSubHeading>

			<StyledHeading as="h2" variant="subtitle1">
				{title}
			</StyledHeading>

			{imageSrc && <StyledImage src={imageSrc} alt={title} />}

			{chipTags &&
				chipTags.map((text) => (
					<StyledChip
						key={text}
						size="small"
						color="default"
						variant="outlined"
						label={text}
					/>
				))}

			<div>
				{description}&nbsp;
				{readMoreText && link && (
					<StyledLearnMoreLink
						size="small"
						color="info"
						variant="text"
						href={link}
						target="_blank"
						rel="noopener noreferrer"
					>
						{readMoreText}
					</StyledLearnMoreLink>
				)}
			</div>

			{cta && ctaLink && (
				<StyledCtaLink
					size="small"
					color="promotion"
					variant="contained"
					href={ctaLink}
					target="_blank"
					rel="noopener noreferrer"
				>
					{cta}
				</StyledCtaLink>
			)}
		</StyledContainer>
	);
};

WhatsNewNotification.propTypes = {
	topic: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	imageSrc: PropTypes.string,
	description: PropTypes.string.isRequired,
	readMoreText: PropTypes.string,
	link: PropTypes.string,
	cta: PropTypes.string,
	ctaLink: PropTypes.string,
	chipTags: PropTypes.arrayOf(PropTypes.string),
};

export default WhatsNewNotification;
