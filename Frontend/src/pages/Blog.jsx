
import React, { useEffect, useState } from 'react';
import { Container, Heading, Box, Spinner, Text, Link, Image } from '@chakra-ui/react';
import axios from 'axios';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = '3d3fa0dbfd4b4fbab62f850b4e845b5e'; // Replace with your NewsAPI key
  const API_URL = 'https://newsapi.org/v2/everything?q=tech%20forum&apiKey=';

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}${API_KEY}`);
        // Filter articles to keep only those with source and image URL
        const filteredArticles = response.data.articles.filter(article => 
          article.source && article.source.name && article.urlToImage
        );
        setArticles(filteredArticles);
      } catch (error) {
        setError('Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <Container maxW="container.md" mt={5}>
      <Heading mb={5} textAlign={'center'}>News Blog</Heading>
      {loading && <Spinner />}
      {error && <Text color="red.500">{error}</Text>}
      {articles.length > 0 ? (
        articles.map((article, index) => (
          <Box key={index} borderWidth="1px" borderRadius="lg" p={5} mb={5}>
            <Link href={article.url} isExternal>
              <Image src={article.urlToImage} alt={article.title} borderRadius="md" />
              <Heading size="md" mt={2}>{article.title}</Heading>
              <Text mt={2}>{article.description}</Text>
              <Text fontSize="sm" color="gray.500">{article.source.name}</Text>
            </Link>
          </Box>
        ))
      ) : (
        <Text color="gray.500">No articles available.</Text>
      )}
    </Container>
  );
};

export default Blog;
