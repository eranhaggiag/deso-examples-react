import { ERROR_TYPES, getHodlersForUser, getNFTsForUser, identity, sellCreatorCoin, submitPost } from "deso-protocol";
import { useContext } from "react";
import { DeSoIdentityContext } from "react-deso-protocol";
import React, { useState } from 'react';



export const ListCoins = () => {
  const { currentUser, isLoading } = useContext(DeSoIdentityContext);
  var [coins, setCoins] = useState([]);
  const desoToUSD = 40;
  var [selectedCoins, setSelectedCoins] = useState([]);

  const getSelectedCreatorCoins = () => {
    // Return the selected coins
    return selectedCoins;
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser || !currentUser.BalanceNanos) {
    return (


            <>
            Loading...
       </>
    );
    } else {
    const bil = 1000000000;
    return (
      <>

<button
  onClick={() => {
    setSelectedCoins(coins);
  }}
>
  Select All
</button>
       <button
          onClick={() => {
            console.log("Sell all selected creator coins");
            coins = getSelectedCreatorCoins();
            //take first 10 coins
            coins = coins.slice(0, 525); 
            var index = 0;
            coins.forEach((coin) => {
              // Perform an action on each coin
              console.log(`Performing action on coin: ${coin}`);
              index++;
              sellCreatorCoinForMe(currentUser, coin);
            });
            console.log(coins);
          } }>SellSelected</button><button
            onClick={() => {
              identity
                .login({
                  getFreeDeso: true,
                })
                .catch((err) => {
                  if (err?.type === ERROR_TYPES.NO_MONEY) {
                    alert("You need DESO in order to post!");
                  } else {
                    alert(err);
                  }
                });
            } }
          >
        </button>

        <h1>List all user's creator coins</h1>
        <button
          onClick={async () => {
            // Assuming the user's ID is stored in a variable `userId`
         try {
             const options = {
              
                PublicKeyBase58Check: "BC1YLj3vATbSCh7Z7WwZMtrvuV48TvsG2uS1yqC98RZEPaTHtMygM7v",
                FetchHodlings: true,
                FetchAll: true
              }
             ;
             const response = await getHodlersForUser(options);
             setCoins(response.Hodlers);

         } catch (error) {
          console.error('There was a problem getting the NFTs:', error);

         }
          }}
        >
          Get Creator Coins
        </button>
        <table>
      <thead>
        <tr>
          <th>Checkbox</th>
          <th>Creator</th>
          <th>Balance</th>
          <th>Total Value</th>
        </tr>
      </thead>
      <tbody>
        <label>Creator Coins : {coins.length} </label>
        {coins.map((coin, index) => (
          <tr key={index}>
            <td>    <input 
      type="checkbox"
      checked={selectedCoins.includes(coin)}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedCoins([...selectedCoins, coin]);
        } else {
          setSelectedCoins(selectedCoins.filter((c) => c !== coin));
        }
      }}
    /></td>
            <td>{coin.ProfileEntryResponse.Username}</td>
            <td>{coin.BalanceNanos/bil}</td>
            <td>{coin.BalanceNanos/bil * coin.ProfileEntryResponse.CoinPriceDeSoNanos/bil * desoToUSD}</td>
            <td><button onClick={() => {
              //Sell the creator coin with in this ProfileEntryResponse
              console.log(`Selling coin with balance: ${coin.BalanceNanos}`);
              sellCreatorCoinForMe(currentUser, coin);
            }
            }
            >Sell
              </button></td>
          </tr>
        ))}
      </tbody>
    </table>

      </>
    );
  }
};
function sellCreatorCoinForMe(currentUser, coin) {
  sellCreatorCoin({
    UpdaterPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
    CreatorPublicKeyBase58Check: coin.ProfileEntryResponse.PublicKeyBase58Check,
    CreatorCoinToSellNanos: coin.BalanceNanos
  }).then((resp) => {
    console.log(resp);
  });
}

