import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import Mic from "@material-ui/icons/Mic";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from "components/CustomButtons/Button.jsx"
import StopWordsCard from "components/DashCards/StopWordsCard.jsx"
import CursesCard from "components/DashCards/CursesCard.jsx"
import PitchDurationCard from "components/DashCards/PitchDurationCard.jsx"
import WPMCard from "components/DashCards/WPMCard.jsx"

import { bugs, website, server } from "variables/general";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class PitchAnalysis extends React.Component {
    state = {
        pitch_try: {
            transcript: '',
            duration: 0,
            analysis_concepts: {},
            analysis_words: {
                explitives: '',
                stop_words: '',
                tone: ''
            },
            transcription: null,
            words_per_minute: 0
        }
    };

  componentDidMount() {
    const pitch_attempt_id = this.props.location.hash.split('#')[1]

    if(pitch_attempt_id === undefined){
        this.setState({
            pitch_try: {
                transcription: null,
                duration: null,
                analysis_concepts: {},
                analysis_words: {
                    explitives: null,
                    stop_words: null,
                    tone: null
                },
                words_per_minute: null  
            }
        })
    } else {
        fetch('http://localhost:5000/pitch_try/' + pitch_attempt_id).then((resp) => resp.json())
            .then((res_json) => {
                this.setState({
                    pitch_try: {
                        ...res_json.pitch_try
                    }
                });
        })
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes } = this.props;
    
    const pitch_try = this.state.pitch_try;    
    
    const { duration, words_per_minute, transcription } = pitch_try;
    const { stop_words, explitives, tone } = pitch_try.analysis_words;

    const tone_sentence = [];

    if (tone['sentences_tone'] !== undefined) {
        tone['sentences_tone'].forEach((sent, index) => {
            if(sent['tones'].length === 0){
                tone_sentence.push(<span key={index}>{sent['text'] + ' '}</span>);
            } else {
                switch(sent['tones'][0]['tone_name']){
                    case 'Anger': {
                        tone_sentence.push(<span style={{color: 'red'}} key={index}>{sent['text'] + ' '}</span>);
                        break;
                    }
                    case 'Fear': {
                        tone_sentence.push(<span style={{color: 'green'}} key={index}>{sent['text'] + ' '}</span>);
                        break;
                    }
                    case 'Joy': {
                        tone_sentence.push(<span style={{color: 'yellow'}} key={index}>{sent['text'] + ' '}</span>);
                        break;
                    }
                    case 'Sadness': {
                        tone_sentence.push(<span style={{color: 'orange'}} key={index}>{sent['text'] + ' '}</span>);
                        break;
                    }
                    case 'Analytical': {
                        tone_sentence.push(<span style={{color: 'blue'}} key={index}>{sent['text'] + ' '}</span>);
                        break;
                    }
                    case 'Confident': {
                        tone_sentence.push(<span style={{color: 'purple'}} key={index}>{sent['text'] + ' '}</span>);
                        break;
                    }
                    case 'Tentative': {
                        tone_sentence.push(<span style={{color: 'blue'}} key={index}>{sent['text'] + ' '}</span>);
                        break;
                    }
                    default: {
                        tone_sentence.push(<span key={index}>{sent['text'] + ' '}</span>);
                        console.log('Unknown');
                    }
                }
            }

        });
    }

    return (
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <StopWordsCard stopWords={stop_words} classes={classes}/>
          </GridItem>

          <GridItem xs={12} sm={6} md={3}>
            <CursesCard explitives={explitives} classes={classes}/>
          </GridItem>

          <GridItem xs={12} sm={6} md={3}>
            <PitchDurationCard duration={duration} classes={classes}/>
          </GridItem>

          <GridItem xs={12} sm={6} md={3}>
            <WPMCard wpm={words_per_minute} classes={classes}/>
          </GridItem>

        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Pitch Transcription</h4>
                <p className={classes.cardCategoryWhite}>
                  Complete Transcription of Your Pitch
                </p>
              </CardHeader>
              <CardBody>
                <p>
                {transcription}
                </p>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Tone Analysis (RAW JASON)</h4>
                <p className={classes.cardCategoryWhite}>
                  Tone Anaylsis of pitch
                </p>
              </CardHeader>
              <CardBody>
                <p>
                {tone_sentence}
                </p>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Raw JSON</h4>
                <p className={classes.cardCategoryWhite}>
                  Raw analysis from our model
               </p>
              </CardHeader>
              <CardBody>
                <p>
                  {JSON.stringify(pitch_try, null, 4)}
                </p>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    );
  }
}

PitchAnalysis.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(PitchAnalysis);
