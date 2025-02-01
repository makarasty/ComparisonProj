# ComparisonProj client

*Приклад коду компонента для порівняння (CompareTable):*

```tsx
import React from "react";
import { Box, Typography, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Tooltip, alpha, useTheme } from "@mui/material";
import { IProduct } from "../types/product";
import { isNumeric } from "../services/productService";

const universalFields = ["image", "title", "brand", "category", "price", "rating"];
const fieldTranslations: Record<string, string> = {
  image: "Зображення",
  title: "Назва",
  brand: "Бренд",
  category: "Категорія",
  price: "Ціна",
  rating: "Рейтинг",
};

const numericPreferences: Record<string, "min" | "max"> = {
  price: "min",
  rating: "max",
};

function getUniversalValue(prod: IProduct, field: string): unknown {
  switch (field) {
    case "image": return prod.image || "-";
    case "title": return prod.title || "-";
    case "brand": return prod.brand || "-";
    case "category": return prod.category || "-";
    case "price": return prod.price;
    case "rating": return prod.rating;
    default: return "-";
  }
}

const CompareTable: React.FC<{ products: IProduct[]; onRemove: (uuid: number) => void; onClearAll: () => void; }> = ({ products, onRemove, onClearAll }) => {
  const theme = useTheme();
  if (!products.length) return null;
  
  // Формування списку полів для порівняння
  const allFields = new Set<string>(universalFields);
  products.forEach((p) => {
    Object.keys(p.specifications || {}).forEach((key) => allFields.add(key));
  });
  const fieldList = Array.from(allFields);
  
  // Створення мапи значень по кожному товару
  const valuesByProduct: Record<number, Record<string, unknown>> = {};
  products.forEach((p) => {
    const map: Record<string, unknown> = {};
    fieldList.forEach((field) => {
      map[field] = universalFields.includes(field)
        ? getUniversalValue(p, field)
        : p.specifications?.[field] ?? "-";
    });
    valuesByProduct[p.uuid] = map;
  });
  
  // Обчислення кращих значень для числових характеристик
  const bestValues: Record<string, number> = {};
  fieldList.forEach((field) => {
    let best = numericPreferences[field] === "min" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    products.forEach((p) => {
      const val = valuesByProduct[p.uuid][field];
      if (isNumeric(val)) {
        if (numericPreferences[field] === "min" && val < best) best = val;
        else if (numericPreferences[field] === "max" && val > best) best = val;
      }
    });
    if (best !== Number.POSITIVE_INFINITY && best !== Number.NEGATIVE_INFINITY) bestValues[field] = best;
  });
  
  // Підрахунок перемог по кожному товару
  const winsCount: Record<number, number> = {};
  products.forEach((p) => { winsCount[p.uuid] = 0; });
  fieldList.forEach((field) => {
    if (bestValues[field] !== undefined) {
      products.forEach((p) => {
        const val = valuesByProduct[p.uuid][field];
        if (isNumeric(val) && val === bestValues[field]) winsCount[p.uuid] += 1;
      });
    }
  });
  
  // Рендеринг таблиці
  return (
    <Box sx={{ mt: 6, overflowX: "auto" }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
        <Typography variant="h5" fontWeight="bold">Порівняння</Typography>
        <Button variant="outlined" color="error" onClick={onClearAll}>Очистити все</Button>
      </Box>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, minWidth: 800, overflowX: "auto" }}>
        {/* Розмітка таблиці */}
      </TableContainer>
    </Box>
  );
};

export default CompareTable;
```

---

**2. Компонент картки товару (ProductCard)**

Компонент ProductCard відповідає за відображення інформації про окремий товар: зображення, назву, опис, категорію, ціну, рейтинг та кнопку для додавання або видалення товару зі списку порівняння.

```tsx
import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Tooltip,
  Typography,
  Chip,
  Rating,
  Button,
} from "@mui/material";
import { IProduct } from "../types/product";

interface ProductCardProps {
  product: IProduct;
  inCompare: boolean;
  toggleCompare: (product: IProduct) => void;
  compareListLength: number;
  maxCompareItems: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  inCompare,
  toggleCompare,
  compareListLength,
  maxCompareItems,
}) => {
  const buttonLabel = inCompare ? "Видалити з порівняння" : "Додати до порівняння";
  
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2, "&:hover": { transform: "scale(1.01)" } }} elevation={4}>
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.title}
        sx={{ objectFit: "contain", bgcolor: "background.default" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Tooltip title={product.title}>
            <Typography variant="h6" noWrap>{product.title}</Typography>
          </Tooltip>
          {product.category && <Chip label={product.category} size="small" color="primary" />}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {product.description.length > 60 ? `${product.description.slice(0, 60)}...` : product.description}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Typography variant="subtitle1" color="primary">${product.price}</Typography>
          <Rating value={product.rating} precision={0.5} readOnly />
        </Box>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color={inCompare ? "primary" : "secondary"}
          onClick={() => toggleCompare(product)}
          disabled={!inCompare && compareListLength >= maxCompareItems}
        >
          {buttonLabel}
        </Button>
        {!inCompare && compareListLength >= maxCompareItems && (
          <span style={{ color: "red", fontSize: "0.8rem" }}>Максимум досягнуто</span>
        )}
      </Box>
    </Card>
  );
};

export default ProductCard;
```

---

**3. Основний компонент додатку (App.tsx)**

Головний компонент клієнтської частини організовує роботу додатку, завантажує список товарів із API, організовує фільтрацію, а також управляє списком товарів для порівняння. Також реалізовано перемикання темного/світлого режиму.

```tsx
import React, { useState, useCallback, useEffect, useMemo } from "react";
import {Container, Typography, Box, Button, TextField, Select, MenuItem, Fab, Zoom, IconButton, CssBaseline, Alert, Grid} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { IProduct } from "./types/product";
import { fetchProducts, seedProducts } from "./services/productService";
import CompareTable from "./components/CompareTable";
import ProductCard from "./components/ProductCard";

const MAX_COMPARE_ITEMS = 4;

const App: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [compareUuids, setCompareUuids] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("compareList") || "[]");
    } catch {
      return [];
    }
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem("darkMode") || "false");
    } catch {
      return false;
    }
  });
  // ... Додаткові стани для фільтрів

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#1976d2" },
          secondary: { main: "#ff9800" },
          background: { default: darkMode ? "#121212" : "#f6f9fc", paper: darkMode ? "#1e1e1e" : "#ffffff" },
          text: { primary: darkMode ? "#ffffff" : "#333333" },
        },
      }),
    [darkMode]
  );

  // Завантаження даних
  const loadData = useCallback(async () => {
    try {
      const data = await fetchProducts();
      if (!data || data.length === 0) throw new Error("Немає даних");
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Управління списком для порівняння
  const toggleCompare = useCallback((product: IProduct) => {
    setCompareUuids((prev) =>
      prev.includes(product.uuid) ? prev.filter((id) => id !== product.uuid) : (prev.length >= MAX_COMPARE_ITEMS ? prev : [...prev, product.uuid])
    );
  }, [compareUuids]);

  // ... Логіка фільтрації, перемикання тем, прокрутки та ін.

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" fontWeight="bold">Крутий сервіс</Typography>
          <IconButton onClick={() => setDarkMode((prev) => !prev)}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          {products.map((prod) => (
            <Grid item xs={12} sm={6} md={4} key={prod.uuid}>
              <ProductCard
                product={prod}
                inCompare={compareUuids.includes(prod.uuid)}
                toggleCompare={toggleCompare}
                compareListLength={compareUuids.length}
                maxCompareItems={MAX_COMPARE_ITEMS}
              />
            </Grid>
          ))}
        </Grid>
        <CompareTable
          products={products.filter((p) => compareUuids.includes(p.uuid))}
          onRemove={(uuid) => setCompareUuids((prev) => prev.filter((id) => id !== uuid))}
          onClearAll={() => setCompareUuids([])}
        />
      </Container>
      <Box sx={{ textAlign: "center", py: 2, bgcolor: darkMode ? "#1c1c1c" : "#e0e0e0" }}>
        <Typography variant="body2">© 2025 MKY was here</Typography>
      </Box>
    </ThemeProvider>
  );
};

export default App;
```

---

**4. Серверна частина – контролери та роутинг**

Контролери обробляють запити клієнтів, забезпечуючи CRUD операції та seed бази даних. Роутинг організовано через Express, що дозволяє зв’язати URL запити із відповідними функціями.

_Контролер для роботи з пристроями (deviceController.ts):_

```ts
import { Request, Response } from "express";
import * as deviceService from "../utils/databaseUtils";

export async function getDevices(req: Request, res: Response) {
  try {
    const devices = await deviceService.getAllDevices();
    res.json({ data: devices });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
}

export async function seedDevices(req: Request, res: Response) {
  try {
    const inserted = await deviceService.insertDevices();
    res.json({ message: "Database seeded", data: inserted });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
}

// Інші функції (getDeviceById, createDevice, updateDevice, deleteDevice)...
```

_Файл роутів (deviceRoutes.ts):_

```ts
import { Router } from "express";
import {
  getDevices,
  seedDevices,
  // Інші контролери...
} from "../controllers/deviceController";

const router = Router();

router.get("/", getDevices);
router.get("/seed/devices", seedDevices);
// Додаткові маршрути для POST, PUT, DELETE

export default router;
```

_Основний файл сервера (index.ts):_

```ts
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import connectDB from "./config/db";
import deviceRoutes from "./routes/deviceRoutes";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cors());

app.use("/api/devices", deviceRoutes);

const PORT = process.env.PORT || 5305;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

**5. Схема даних для пристроїв (deviceModel.ts) з використанням Mongoose**

Ця схема описує основні властивості товарів, додаткові поля, а також використовує віртуальні властивості та middleware для попередньої обробки даних.

```ts
import { Schema, model, Document } from "mongoose";
import { IProduct } from "../interfaces/Product";

interface ProductDocument extends IProduct, Document {}

const dimensionsSchema = new Schema({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  depth: { type: Number, required: true },
  weight: { type: Number },
  unit: { type: String },
}, { _id: false });

const warrantySchema = new Schema({
  period: { type: Number, required: true },
  unit: { type: String, required: true, enum: ["days", "months", "years"] },
  description: { type: String },
}, { _id: false });

const productSchema = new Schema({
  uuid: { type: Number, required: true, unique: true, index: true },
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  brand: { type: String, trim: true, index: true },
  category: { type: String, trim: true, index: true },
  image: { type: String, trim: true },
  images: [{ type: String, trim: true }],
  rating: { type: Number, min: 0, max: 5, default: 0 },
  stock: { type: Number, min: 0, default: 0 },
  specifications: { type: Map, of: Schema.Types.Mixed },
  // Додаткові поля: warranty, metadata, dimensions...
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Віртуальна властивість для ціни зі знижкою
productSchema.virtual("priceWithDiscount").get(function () {
  if (!this.discount) return this.price;
  return this.price * (1 - this.discount / 100);
});

// Middleware для встановлення статусу доступності
productSchema.pre("save", function (next) {
  this.available = Boolean(this.stock && this.stock > 0);
  next();
});

export const Product = model<ProductDocument>("Product", productSchema);
export default Product;
```