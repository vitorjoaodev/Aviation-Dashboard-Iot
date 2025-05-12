import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("operator"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Runway data
export const runways = pgTable("runways", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  temperature: doublePrecision("temperature"),
  friction: doublePrecision("friction"),
  precipitation: doublePrecision("precipitation"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Weather data
export const weather = pgTable("weather", {
  id: serial("id").primaryKey(),
  temperature: doublePrecision("temperature"),
  feelsLike: doublePrecision("feels_like"),
  humidity: doublePrecision("humidity"),
  dewPoint: doublePrecision("dew_point"),
  visibility: doublePrecision("visibility"),
  qnh: doublePrecision("qnh"),
  windDirection: doublePrecision("wind_direction"),
  windSpeed: doublePrecision("wind_speed"),
  windGust: doublePrecision("wind_gust"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Equipment status
export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull(),
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  nextMaintenanceDate: timestamp("next_maintenance_date"),
  details: jsonb("details"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Incidents
export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  referenceId: text("reference_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull(),
  location: text("location"),
  reportedBy: integer("reported_by").references(() => users.id),
  actions: jsonb("actions"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Weather alerts
export const weatherAlerts = pgTable("weather_alerts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon"),
  active: boolean("active").default(true),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Critical alerts
export const criticalAlerts = pgTable("critical_alerts", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  acknowledged: boolean("acknowledged").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertRunwaySchema = createInsertSchema(runways).omit({
  id: true,
  lastUpdated: true,
});

export const insertWeatherSchema = createInsertSchema(weather).omit({
  id: true,
  timestamp: true,
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
  lastUpdated: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  timestamp: true,
});

export const insertWeatherAlertSchema = createInsertSchema(weatherAlerts).omit({
  id: true,
  timestamp: true,
});

export const insertCriticalAlertSchema = createInsertSchema(criticalAlerts).omit({
  id: true,
  timestamp: true,
  acknowledged: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRunway = z.infer<typeof insertRunwaySchema>;
export type Runway = typeof runways.$inferSelect;

export type InsertWeather = z.infer<typeof insertWeatherSchema>;
export type Weather = typeof weather.$inferSelect;

export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipment.$inferSelect;

export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;

export type InsertWeatherAlert = z.infer<typeof insertWeatherAlertSchema>;
export type WeatherAlert = typeof weatherAlerts.$inferSelect;

export type InsertCriticalAlert = z.infer<typeof insertCriticalAlertSchema>;
export type CriticalAlert = typeof criticalAlerts.$inferSelect;
