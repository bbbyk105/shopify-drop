import { Metadata } from "next";
import FavoriteClient from "./FavoriteClient";

export const metadata: Metadata = {
  title: "My Favorites - Evimeria Home",
  description: "View your favorite products",
};

export default function FavoritePage() {
  return <FavoriteClient />;
}
