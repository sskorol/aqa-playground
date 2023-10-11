import React from 'react';
import { Divider, Grid, List, ListItem, ListItemText } from '@mui/material';
import { observer } from 'mobx-react-lite';
import cartStore from '../../stores/CartStore';

const CheckoutList: React.FC = observer(() => {
  const GetItemList = () => {
    return cartStore.cart.map((item) => {
      return (
        <ListItem key={item.id}>
          <Grid container>
            <Grid item lg={6} sx={{ textAlign: 'left' }}>
              <ListItemText className='title' primary={item.title} />
            </Grid>
            <Grid item lg={2}>
              <ListItemText className='quantity' primary={item.quantity} />
            </Grid>
            <Grid item lg={2}>
              <ListItemText className='price' primary={item.price} />
            </Grid>
            <Grid item lg={2} sx={{ textAlign: 'right' }}>
              <ListItemText className='sum' primary={(item.price * item.quantity).toFixed(2)} />
            </Grid>
          </Grid>
        </ListItem>
      );
    });
  };

  const GetSumListItem = () => {
    const sum = cartStore.cart
      .map((item) => item.price * item.quantity)
      .reduce((prev, next) => prev + next, 0);
    return (
      <ListItem>
        <Grid container>
          <Grid item lg={6} sx={{ textAlign: 'left' }}>
            <ListItemText primary={'Total'} />
          </Grid>
          <Grid item lg={2}></Grid>
          <Grid item lg={2}></Grid>
          <Grid item lg={2} sx={{ textAlign: 'right' }}>
            <ListItemText className='total' primary={sum.toFixed(2)} />
          </Grid>
        </Grid>
      </ListItem>
    );
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <GetItemList />
      <Divider />
      <GetSumListItem />
    </List>
  );
});

export default CheckoutList;
