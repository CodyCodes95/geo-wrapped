import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Globe2, Map, Target, Trophy, Clock } from "lucide-react";


const PlayerDashboard = ({ player }: { player: any }) => {
  // This would be replaced with real data
  const demoPlayer = {
    nick: "GeoMaster",
    avatarUrl: "/api/placeholder/150/150",
    countryCode: "US",
    // Add more player stats here as we implement them
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 rounded-lg bg-white p-6 shadow-sm">
        <Avatar className="h-24 w-24">
          <AvatarImage src={demoPlayer.avatarUrl} alt={demoPlayer.nick} />
          <AvatarFallback>{demoPlayer.nick[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{demoPlayer.nick}</h1>
          <p className="text-gray-600">
            {demoPlayer.countryCode} • Member since {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Total Games</p>
                <p className="text-2xl font-bold">123</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-green-500" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Avg. Score</p>
                <p className="text-2xl font-bold">4,821</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Globe2 className="h-4 w-4 text-blue-500" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Countries Visited</p>
                <p className="text-2xl font-bold">42</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Map className="h-4 w-4 text-purple-500" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Favorite Map</p>
                <p className="text-2xl font-bold">World</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maps">Maps</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add charts/stats here */}
              <div className="flex h-[200px] items-center justify-center rounded border">
                Performance Chart Placeholder
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add other tab contents */}
      </Tabs>
    </div>
  );
};

export default PlayerDashboard;