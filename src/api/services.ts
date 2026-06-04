import api from "./manager";
import ENDPOINTS from "./endpoints";


export const fetchFurnitureList = async (skip: number = 0, limit: number = 20) => {
  const response = await api.get(ENDPOINTS.PRODUCTS, {
    params: { skip, limit },
  });

  return response.data;
};


export const fetchProductDetail = async (productId: number | string) => {
  const formData = new URLSearchParams();
  formData.append('product_id', String(productId));

  const response = await api.post(
    ENDPOINTS.PRODUCTS,
    formData.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data;
};