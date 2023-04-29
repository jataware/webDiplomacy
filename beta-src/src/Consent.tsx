/**
 * Presentational page that displays and captures a player's IRB-consent
 * acceptance, or declines to play and gets logged out. Receives accept/decline
 * function handler props.
 **/

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Text from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const articles = [
    {
        heading: false,
        text: 'We are inviting you to participate in a research study into the role of player negotiation in the board game Diplomacy. The study, titled “Collection and analysis of online Diplomacy gameplay,” is part of a project funded by the U.S. Department of Defense.  I will describe this study to you and answer any of your questions.  This study is led by Prof. Garrison LeMasters, Miami University Dept. of Emerging Technologies.'
    },
    {
        heading: 'What the study is about',
     text: 'The purpose of this research is to develop an artificial intelligence that can meaningfully compete with human players of the board game Diplomacy. In order to build an AI that can succeed at the game of Diplomacy, we have designed an interface that humans can use to play the game, and we will train the AI on the data that human users generate through their game play.'
    },
    {
        heading: 'What we will ask you to do',
        text: 'We will ask you to play an anonymized game of Diplomacy using our interface to communicate with other players.  A game of Diplomacy can take up to six hours. Other than the interface we provide for in-game communication (“press”) and online gameplay, there are no changes to the game.'
    },
    {
        heading: 'Risks and discomforts',
        text: 'We do not anticipate any risks from participating in this research.'
    },
    {
        heading: 'Benefits',
        text: 'There are no direct benefits to participants of this study. Information from this study may help to build AI that can successfully negotiate with other AI or with humans, specifically in contract disputes or diplomatic negotiations.'
    },
    {
        heading: 'Compensation for participation',
        text: 'Students who participate in this study and are enrolled in IMS443 (Games Research) will receive in-class credit, per the syllabus (Spring 2022).  Students not enrolled in that course may receive monetary compensation of $400.'
    },
    {
        heading: 'Privacy/Confidentiality/Data Security',
        text: 'No data will have identifiers attached to it. The survey that we administer after playing should present no greater risk than everyday use of the Internet. Data may exist on backups and server logs beyond the timeframe of this research project. Representatives of the U.S. Department of Defense will have access to research records as part of their responsibilities for human subjects protection oversight of the study.'
    },
    {
        heading: 'Sharing De-identified Data Collected in this Research',
        text: 'De-identified data from this study may be shared with the research community at-large to advance science. We will remove or code any personal information that could identify you before files are shared with other researchers to ensure that, by current scientific standards and known methods, no one will be able to identify you from the information we share. Despite these measures, we cannot guarantee anonymity of your personal data.'
    },
    {
        heading: 'Taking part is voluntary',
        text: 'Participant involvement is voluntary.  You may refuse to participate before the study begins or discontinue at any time. Compensation is dependent upon your completing the study and answering the survey questions afterwards.'
    },
    {
        heading: 'If you have questions',
        text: 'I am the primary researcher conducting this study.  I am Dr. Garrison LeMasters, Dept. of Emerging Technology / Games and Simulation, Miami University of Ohio.  I am happy to talk with you about concerns regarding this research, or you may email me at garrison.lemasters@miamioh.edu'
    }
];


const SubmitContainer = styled('div')(({ theme }) => `
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 1rem;

  button {
    width: 48%;
    margin-bottom: 0.5rem;

    @media (max-width: ${theme.breakpoints.values.sm}px) {
      width: 100%;
    }
  }

`);

// Creates a callback fn that toggles a boolean value
const createToggle = (setterFn, val) => () => setterFn(!val);

/**
 * Application page that describes IRB-mandated consent terms to the user,
 * per research data gathered while playing. If user accepts, the acceptance date
 * gets stored on auth user pool. If user declines, they should be logged out.
 **/
export const ConsentPage = ({onAccept, onDecline}) => {

    // Only allow submit when both checkboxes are accepted
    const [ofAge, setOfAge] = useState(false);
    const [hasRead, setHasRead] = useState(false);

    const [savingConsent, setSavingConsent] = React.useState(false);

    const handleOfAgeChange = createToggle(setOfAge, ofAge);
    const handleHasReadChange = createToggle(setHasRead, hasRead);

    return (
        <Container sx={{maxWidth: 800, margin: "1rem auto 1rem auto"}}>
            <section style={{margin: "1rem 0 2rem 0"}}>
                <br />

                <Text
                    variant="h3"
                    paragraph>
                    IRB Research Consent Form
                </Text>

                {articles.map(article => (
                    <article key={article.heading}>
                        {article.heading && (
                            <Text variant="h5" gutterBottom>
                                {article.heading}
                            </Text>
                        )}
                        <Text variant="body1" paragraph>
                            {article.text}
                        </Text>
                    </article>
                ))}

                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox
                                     color="success"
                                     disabled={savingConsent}
                                     onChange={handleOfAgeChange}
                                     disableRipple />}
                        label="I affirm that I am 18 years of age or older;" />
                    <FormControlLabel
                        control={<Checkbox
                                     color="success"
                                     disabled={savingConsent}
                                     onChange={handleHasReadChange}
                                     disableRipple />}
                        label="I affirm that I have read this document and understand the conditions and outcomes of participation in this research study." />
                </FormGroup>

                <p>
                    To electronically sign and submit this document, click here:
                </p>

                <SubmitContainer>
                    <Button
                        disabled={!ofAge || !hasRead || savingConsent}
                        color="success"
                        variant="outlined"
                        sx={{position: "relative"}}
                        onClick={() => {
                          setSavingConsent(true);
                          onAccept();
                        }}>
                      {savingConsent && (
                        <Box sx={{position: "absolute", left: "1rem", display: "flex", alignItems: "center"}}>
                        <CircularProgress size="1.5rem" />
                        </Box>
                      )}
                        I agree to participate
                    </Button>

                    <Button
                        variant="outlined"
                        className="btn btn-secondary"
                        disabled={savingConsent}
                        onClick={onDecline}>
                        I decline to participate
                    </Button>
                </SubmitContainer>

            </section>
        </Container>
    );
};
