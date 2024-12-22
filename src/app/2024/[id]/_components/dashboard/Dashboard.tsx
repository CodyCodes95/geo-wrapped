"use client";
import React from "react";
import { SummaryCards } from "./SummaryCards";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Map from "../map/Map";
import { useRainboltMode } from "./_hooks/useRainboltMode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { GameTable } from "../tables/GameTable";
import { RoundTable } from "../tables/RoundTable";

const Dashboard = () => {
  const { RainboltMode } = useRainboltMode();
  return (
    <>
      {/* Stats Overview */}
      <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCards />
        <RainboltMode />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your guesses</CardTitle>
        </CardHeader>
        <CardContent>
          <Map />
        </CardContent>
      </Card>
      <Tabs defaultValue="games" className="space-y-4">
        <TabsList>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="rounds">Rounds</TabsTrigger>
        </TabsList>

        <TabsContent value="games" className="">
          <GameTable />
        </TabsContent>
        <TabsContent value="games" className="">
          <RoundTable />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Dashboard;
