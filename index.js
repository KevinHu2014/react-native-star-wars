import * as React from 'react';
import {
  ScrollView,
  View,
  Image,
  Text,
  StyleSheet,
  Platform,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import { Font } from 'expo';

export default class StarWars extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    titleStyle: ViewPropTypes.style,
    contentStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    title: 'A NEW HOPE',
    content: 'It is a period of civil war.Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.\nDuring the battle, Rebel spies managed to steal secret plans to the Empire\'s ultimate weapon, the DEATH STAR, an armored space station with enough power to destroy an entire planet.\nPursued by the Empire\'s sinister agents, Princess Leia races home aboard her starship, custodian of the stolen plans that can save her people and restore freedom to the galaxy.....',
    titleStyle: {},
    contentStyle: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      show: false,
    };
    this.scrolling = this.scrolling.bind(this);
  }

  async componentDidMount() {
    await Font.loadAsync({
      'pathway-gothic-one': require('./PathwayGothicOne-Regular.ttf'),// eslint-disable-line
    });

    this.setState({ show: true });
    this.activeInterval = setInterval(this.scrolling, 100);
  }

  componentWillUnmount() {
    clearInterval(this.activeInterval);
  }

  isCloseToBottom = ({ contentOffset, contentSize }) => { // eslint-disable-line
    return contentOffset.y >= contentSize.height;
  };

  scrolling() {
    const { start } = this.state;
    this.scrollView && this.scrollView.scrollTo({ x: 0, y: start, animated: true });// eslint-disable-line
    this.setState({ start: start + 3 });
  }

  render() {
    const {
      title,
      content,
      titleStyle,
      contentStyle,
    } = this.props;
    const { show } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        { Platform.OS === 'ios'
          ? (
            <View style={{ flex: 1, backgroundColor: 'black' }}>
              <Image
                style={{ position: 'absolute', width: '100%', height: '30%' }}
                source={require('./transform.png')} // eslint-disable-line
              />
              {
                show
                  ? (
                    <ScrollView
                      style={styles.container}
                      scrollEventThrottle={16}
                      contentContainerStyle={styles.contentContainer}
                      scrollEnabled={false}
                      onScroll={({ nativeEvent }) => {
                        if (this.isCloseToBottom(nativeEvent)) {
                          clearInterval(this.activeInterval);
                          this.setState({ show: false });
                        }
                      }}
                      ref={(ref) => { this.scrollView = ref; }}
                    >
                      <Text style={[styles.textStyle, { fontSize: 35 }, titleStyle]}>
                        {title}
                      </Text>
                      <Text style={[styles.textStyle, contentStyle]}>
                        {content}
                      </Text>
                    </ScrollView>
                  )
                  : null
              }
          </View>
          )
          : null
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    transform: [
      { perspective: 300 },
      { rotateX: '30deg' },
    ],
  },
  contentContainer: {
    paddingTop: 300,
    margin: 30,
    alignItems: 'center',
  },
  textStyle: {
    color: '#feda4a',
    fontSize: 25,
    fontFamily: 'pathway-gothic-one',
    lineHeight: 30,
    letterSpacing: 6,
    fontWeight: '800',
    textAlign: 'justify',
  },
});
