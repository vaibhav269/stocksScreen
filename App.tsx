import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListRenderItem,
  StatusBar,
} from 'react-native';

const API_URL = 'https://35dee773a9ec441e9f38d5fc249406ce.api.mockbin.io/';

interface Holding {
  symbol: string;
  quantity: number;
  ltp: number;
  avgPrice: number;
  profit?: string;
}

interface Details {
  totalInvestment: string;
  currentVal: string;
}

interface ApiResponse {
  data: {
    userHolding: Holding[];
  };
}

function App(): React.JSX.Element {
  const [userHoldings, setUserHoldings] = useState<Holding[]>([]);
  const [isShowDetails, setIsShowDetails] = useState<boolean>(false);
  const [details, setDetails] = useState<Details>({
    totalInvestment: '0',
    currentVal: '0',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const json: ApiResponse = await response.json();
          let totalInvestment = 0,
            currentVal = 0;
          const newHoldings: Holding[] = json.data.userHolding.map(holding => {
            const profit = (
              holding.quantity *
              (holding.ltp - holding.avgPrice)
            ).toFixed(2);
            totalInvestment += holding.avgPrice * holding.quantity;
            currentVal += holding.ltp * holding.quantity;
            return {...holding, profit};
          });

          setUserHoldings(newHoldings);
          setDetails({
            totalInvestment: totalInvestment.toFixed(2),
            currentVal: currentVal.toFixed(2),
          });
        } else {
          Alert.alert('Some error occured while fetching the data');
        }
      } catch (error) {
        Alert.alert('Some error occured while fetching the data');
      }
    };
    fetchData();
  }, []);

  const handleToggleDetails = () => {
    setIsShowDetails(!isShowDetails);
  };

  const handleRenderItem: ListRenderItem<Holding> = ({item}) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <Text style={[styles.item, styles.bold]}>{item.symbol}</Text>
        <Text style={styles.item}>
          {' '}
          LTP: <Text style={styles.bold}>&#8377;{item.ltp}</Text>
        </Text>
      </View>
      <View style={[styles.row, styles.paddingTop]}>
        <Text style={styles.item}>{item.quantity}</Text>
        <Text style={styles.item}>
          P/L: <Text style={styles.bold}>&#8377;{item.profit}</Text>
        </Text>
      </View>
    </View>
  );

  const totalProfit =
    parseFloat(details.currentVal) - parseFloat(details.totalInvestment);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View>
        <Text style={[styles.header, styles.bold]}>Upstox Holding</Text>
        <View style={styles.sectionList}>
          <FlatList renderItem={handleRenderItem} data={userHoldings} />
        </View>
      </View>
      <View style={styles.sectionSummary}>
        <TouchableOpacity onPress={handleToggleDetails}>
          <View style={styles.toggler}>
            <Image
              style={styles.togglerImage}
              source={
                isShowDetails
                  ? require('./img/chevron-arrow-down.png')
                  : require('./img/chevron-arrow-up.png')
              }
            />
          </View>
        </TouchableOpacity>
        {isShowDetails && Boolean(details) && (
          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={[styles.item, styles.bold]}>Current Value:</Text>
              <Text style={styles.item}>&#8377;{details.currentVal}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.item, styles.bold]}>Total Investment:</Text>
              <Text style={styles.item}>&#8377;{details.totalInvestment}</Text>
            </View>
          </View>
        )}
        <View style={styles.row}>
          <Text style={[styles.item, styles.bold]}>Profit & Loss</Text>
          <Text style={styles.item}>&#8377;{totalProfit.toFixed(2)}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  paddingTop: {
    paddingTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  details: {},
  toggler: {
    alignItems: 'center',
  },
  togglerImage: {
    height: 20,
    width: 20,
  },
  itemContainer: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: 5,
    paddingBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  item: {
    fontSize: 15,
    color: 'black',
  },
  header: {
    backgroundColor: '#7D017D',
    color: 'white',
    padding: 10,
    fontSize: 17,
  },
  container: {
    backgroundColor: '#C3C3C8',
    height: '100%',
    justifyContent: 'space-between',
  },
  sectionList: {
    padding: 10,
    paddingTop: 0,
    backgroundColor: 'white',
    height: '70%',
  },
  sectionSummary: {
    padding: 10,
    backgroundColor: 'white',
  },
});

export default App;
