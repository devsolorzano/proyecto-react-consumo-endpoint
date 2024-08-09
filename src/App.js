import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getJWT = async () => {
    try {
      const response = await fetch('https://play.nextcaddy.com/api/login_check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'insomnia/8.6.1'
        },
        body: JSON.stringify({
          username: '666666666',
          password: 'admin'
        })
      });

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Error fetching JWT:', error);
    }
  };

  const fetchData = async (page) => {
    setLoading(true);
    const token = await getJWT();

    try {
      const response = await fetch(`https://play.nextcaddy.com/api/results?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const result = await response.json();
      setData(prevData => [...prevData, ...result['hydra:member']]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options) + ' ' + date.toLocaleTimeString();
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Resultados de Competencias
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Paper elevation={3} style={{ marginTop: 20, paddingBottom: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Puntaje</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.hcp}</TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
              <CircularProgress />
            </div>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default App;
