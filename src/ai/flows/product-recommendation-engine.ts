'use server';

/**
 * @fileOverview An AI-powered product recommendation engine.
 *
 * - getProductRecommendations - A function that takes a product ID and returns a list of recommended product IDs.
 * - ProductRecommendationInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationInputSchema = z.object({
  productId: z.string().describe('The ID of the product to get recommendations for.'),
  category: z.string().describe('The category of the product.'),
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('The description of the product.')
});

export type ProductRecommendationInput = z.infer<typeof ProductRecommendationInputSchema>;

const ProductRecommendationOutputSchema = z.object({
  recommendedProductIds: z.array(z.string()).describe('An array of product IDs that are frequently bought together with the input product.'),
});

export type ProductRecommendationOutput = z.infer<typeof ProductRecommendationOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationInput): Promise<ProductRecommendationOutput> {
  return productRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationPrompt',
  input: {schema: ProductRecommendationInputSchema},
  output: {schema: ProductRecommendationOutputSchema},
  prompt: `You are a product recommendation engine for an e-commerce store.
  Given a product ID, category, name, and description, you will return a list of product IDs that are frequently bought together with the input product.

  Product ID: {{{productId}}}
  Category: {{{category}}}
  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}

  Return ONLY a JSON array of product IDs.
  `,
});

const productRecommendationFlow = ai.defineFlow(
  {
    name: 'productRecommendationFlow',
    inputSchema: ProductRecommendationInputSchema,
    outputSchema: ProductRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
