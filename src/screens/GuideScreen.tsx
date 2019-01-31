import * as React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { MapData } from '../dummydata/mapData';
import { Region, MovieMarker, ToiletMarker, ElevatorMarker, GuideLine } from 'src/domains/map';
import MovieNavigateComponent from '../components/movieComponents/MovieNavigateComponent';
import SubMovieComponent from '../components/movieComponents/SubMovieComponent';
import MapViewComponent from '../components/mapComponents/MapViewComponent';
import { AuthSession } from 'expo';
import Carousel from 'react-native-snap-carousel';
import Modal from '../components/screenComponents/Modal';


interface Props { navigation: any; }

type ScreenName = 'video' | 'map';

interface BaseState {
  currentScreen: ScreenName | undefined;
  modalFlg: boolean;
}

export interface ActiveMapState extends BaseState{
  indoorLevel: string;
  initializedLocation: Region | undefined;
  movieMarkers: MovieMarker[] | undefined;
  toiletMarkers: ToiletMarker[] | undefined;
  elevatorMarkers: ElevatorMarker[] | undefined;
  guideLines: GuideLine[] | undefined;
}

interface ActiveMovieState extends BaseState {
  movieId: string;
  thumbnails: string[];
  // FIXME 必要なものがわからん
}

type State = ActiveMapState & ActiveMovieState;

export default class GuideScreen extends React.Component<Props, State> {
  public static navigationOptions = {
    headerStyle: { display: 'none' },
  };

  readonly state: State = {
    currentScreen: undefined,
    modalFlg: false,
    carouselData: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
  };

  public componentDidMount () {
    // FIXME 2回目以降はAsyncStorageとか使って以前のScreenを参照するようにしたい
    const currentScreen = this.state.currentScreen === 'video' ? 'video' : 'map'; // defaultは'map'

    if (currentScreen === 'map') {
      this.setState({
        currentScreen,
        indoorLevel: MapData.indoorLevel,
        initializedLocation: MapData.initializedLocation,
        movieMarkers: MapData.movieMarkers,
        guideLines: MapData.guideLines,
        elevatorMarkers: MapData.elevatorMarkers,
      });
    } else {
      // TODO set movie states...
      this.setState({
        currentScreen,
        movieId: 'tmpState', // tmp
        thumbnails: ['OwSekWSe7NM', 'OwSekWSe7NM', 'OwSekWSe7NM', 'OwSekWSe7NM', 'OwSekWSe7NM'],
      });
    }
  }

  public render () {
    // NITS もう少し厳密に判断した方がいい説 :thinking:
    if (this.state.currentScreen == undefined) return null; // TODO loading animation
    if ((this.state.indoorLevel !== undefined) && (this.state.movieId !== undefined)) return null;

    const {
      currentScreen, indoorLevel, initializedLocation, movieMarkers,
      toiletMarkers, elevatorMarkers, guideLines,
    } = this.state;

    return (
      <View style={styles.content_wrap}>
         {
           currentScreen === 'map' ? (
             <>
              <MapViewComponent
                indoorLevel={indoorLevel}
                initializedLocation={initializedLocation!}
                movieMarkers={movieMarkers}
                toiletMarkers={toiletMarkers}
                elevatorMarkers={elevatorMarkers}
                guideLines={guideLines}
                changeIndoorLevel={this.changeIndoorLevel}
              />
             </>
          ) : ( <MovieNavigateComponent />)
         }
        {/* TODO
          MapComponentは常に表示して、ビデオを出し分けるなどしたい
        */}
<<<<<<< HEAD
        <Modal modalView={this.state.modalFlg} >
          <Carousel
            data={this.state.carouselData}
            itemWidth={Dimensions.get('screen').width}
            sliderWidth={Dimensions.get('screen').width}
            sliderHeight={Dimensions.get('screen').height}
            renderItem={() => ( <View style={styles.carousel} />)}
          />
        </Modal>
=======
          <Modal
            modalView={this.state.modalFlg}
            style={styles.modalInViewAround}
          >
            <Carousel
              data={this.state.carouselData}
              itemWidth={Dimensions.get('screen').width}
              sliderWidth={Dimensions.get('screen').width}
              sliderHeight={Dimensions.get('screen').height}
              renderItem={() => {
                return (
                  <View style={styles.carousel}></View>
                  );
              }}
            />
          </Modal>
>>>>>>> 4da6e19... 一度モーダル製作終了
          <View style={styles.modalFlgBottomAround}>
            <TouchableOpacity onPress={this.changeModal} style={styles.modalFlgBottom} >
              <Text style={styles.modalFlgBottomText}>OPEN</Text>
            </TouchableOpacity>
          </View>
      </View>
    );
  }

  private changeModal = () => {
    this.setState({
      modalFlg: this.state.modalFlg ? false : true,
    });
  }

  private changeIndoorLevel = (nextIndoorLevel: string) => {
    const validatedIndoorLevel = nextIndoorLevel.replace(/階/, '');
    const indoorLevel = validatedIndoorLevel.substr(-2);
    this.setState({ indoorLevel });
  }

  private changeModalFlg() {
    const nextModalFlg = !this.state.modalFlg;
    this.setState({
      modalFlg: nextModalFlg,
    });
  }
}

EStyleSheet.build();
const {width, height} = Dimensions.get('screen');

const styles = EStyleSheet.create({
  content_wrap: {
    flex: 1,
    top: 0,
    position: 'relative',
  },
  thumbnails: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 90,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
  thumbnailImage: {
    width: 120,
    height: 90,
  },
  modal: {
    width: width * 0.79,
    height: height * 0.48,
    backgroundColor: 'red',
    marginBottom: height * 0.1,
  },
  modalInView: {
    width: width * 0.79,
    height: height * 0.48,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'red',
    justifyContent: 'center',
  },
  modalInViewAround: {
    width: width,
    height: height * 0.48,
    position: 'absolute',
    bottom: 0,
    marginBottom: height * 0.1,
    justifyContent: 'center',
  },
  modalFlgBottom: {
    width: width * 0.42,
    height: height * 0.1,
    backgroundColor: 'red',
  },
  modalFlgBottomText: {
    bottom: 0,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  modalFlgBottomAround: {
    width: width,
    height: width * 0.07,
    position: 'absolute',
    bottom: 0,
    //marginBottom:  height * 0.07,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  carousel: {
    width: width * 0.79,
    height: height * 0.33,
    backgroundColor: 'red',
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    marginLeft: width * 0.1,
  },
  view: {
    width: width,
    height: '50%',
    backgroundColor: 'rgba(50, 50, 50, 1)',
  },
});
