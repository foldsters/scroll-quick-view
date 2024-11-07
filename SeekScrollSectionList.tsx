import {StyleSheet, Text, View, SectionList, PanResponder, SectionListData, DefaultSectionT} from 'react-native';
import alienPlantData from './data';
import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export const SeekScrollSectionList = () => {
  const sectionListRef = useRef<SectionList>(null);
  const [height, setHeight] = useState(0);
  const [startY, setStartY] = useState(0);
  const onMoveHandler = useRef((y0: number, dy: number) => {});
  let lastSectionIndex = 0;

  onMoveHandler.current = (y0: number, dy: number) => {
    if (sectionListRef.current) {
      const numItems = alienPlantData.length;
      const offset = Math.min(Math.max(0, Math.floor((dy+y0-startY)*numItems/height)), numItems-1);
      if(lastSectionIndex == offset) return;
      console.log('onPanResponder Move', offset);
      sectionListRef.current.scrollToLocation({
        animated: false,
        itemIndex: 0,
        sectionIndex: offset,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      lastSectionIndex = offset;
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => onMoveHandler.current(gestureState.y0, gestureState.dy),
    }),
  ).current;

  const renderItem = ({item}: {item: string}) => (
    <View style={styles.item}>
      <Text style={styles.speciesName}>{item}</Text>
    </View>
  );

  const renderSectionHeader = ({section: {title}}: { section: SectionListData<string, DefaultSectionT> }) => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.headerGradient}
      >
        <Text style={styles.header}>{title}</Text>
      </LinearGradient>
    </View>
  );

  return (
    <View 
      style={styles.container}
      onLayout={(event) => {
        setStartY(event.nativeEvent.layout.y);
        setHeight(event.nativeEvent.layout.height);
      }}>
      <LinearGradient
        colors={['#0002', '#5554']}
        style={styles.quickViewBackdrop}
        {...panResponder.panHandlers}
      />      
      <View
        style={styles.quickView}
        {...panResponder.panHandlers}
      />
      <SectionList
        ref={sectionListRef}
        style={styles.sectionList}
        sections={alienPlantData}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        onScrollToIndexFailed={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  sectionList: {
    flex: 1,
  },
  quickViewBackdrop: {
    zIndex: -1,
    position: 'absolute',
    right: 0,
    top: 10,
    bottom: 0,
    width: 26,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ffffff20',
    borderRightColor: '#ffffff20',
    marginRight: 14
  },
  quickView: {
    zIndex: 1,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 32,
    marginRight: 6
  },
  headerContainer: {
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: '#4fc3f7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  item: {
    backgroundColor: '#ffffff08',
    marginVertical: 2,
    marginLeft: 16,
    marginRight: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },
  speciesName: {
    fontSize: 16,
    color: '#81d4fa',
    padding: 12,
    fontFamily: 'monospace',
  },
});