import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./Categories.module.css";

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Women's Fashion",
      image:
        "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600",
      itemCount: 245,
      overlayClass: styles.overlayPink,
    },
    {
      id: 2,
      name: "Men's Collection",
      image:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600",
      itemCount: 189,
      overlayClass: styles.overlayBlue,
    },
    {
      id: 3,
      name: "Accessories",
      image:
        "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600",
      itemCount: 156,
      overlayClass: styles.overlayPurple,
    },
    {
      id: 4,
      name: "Home & Living",
      image:
        "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
      itemCount: 298,
      overlayClass: styles.overlayEmerald,
    },
    {
      id: 5,
      name: "Electronics",
      image:
        "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600",
      itemCount: 167,
      overlayClass: styles.overlayOrange,
    },
    {
      id: 6,
      name: "Beauty & Care",
      image:
        "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600",
      itemCount: 223,
      overlayClass: styles.overlayAmber,
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Shop by Category</h2>
          <p className={styles.description}>
            Explore our diverse range of carefully curated categories
          </p>
        </div>

        <div className={styles.grid}>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className={styles.categoryCard}
            >
              <div className={styles.imageContainer}>
                <img
                  src={category.image}
                  alt={category.name}
                  className={styles.categoryImage}
                />
                <div
                  className={`${styles.overlay} ${category.overlayClass}`}
                ></div>

                <div className={styles.content}>
                  <h3 className={styles.categoryName}>{category.name}</h3>
                  <p className={styles.itemCount}>{category.itemCount} items</p>

                  <div className={styles.exploreButton}>
                    <span>Explore</span>
                    <ArrowRight className={styles.exploreIcon} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.viewAllContainer}>
          <Link to="/categories" className={styles.viewAllButton}>
            View All Categories
            <ArrowRight className={styles.viewAllIcon} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
