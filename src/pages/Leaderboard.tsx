import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { Trophy, Flame, Target, Medal } from 'lucide-react'
import { useLeaderboard } from '@/hooks'

export default function Leaderboard() {
  const { t } = useTranslation()

  const { data: globalLeaderboard = [] } = useLeaderboard('global')
  const { data: weeklyLeaderboard = [] } = useLeaderboard('weekly')

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500 text-white'
      case 2:
        return 'bg-gray-400 text-white'
      case 3:
        return 'bg-orange-600 text-white'
      default:
        return 'bg-muted'
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />
    return null
  }

  const renderLeaderboard = (entries: typeof globalLeaderboard) => (
    <Card>
      <CardHeader>
        <CardTitle>{t('leaderboard.title', 'Leaderboard')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {t('leaderboard.noData', 'No data available')}
          </p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-3 rounded-lg ${
                entry.isCurrentUser ? 'bg-primary/10 border border-primary/30' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${getRankColor(entry.rank)}`}>
                  {getRankIcon(entry.rank) || entry.rank}
                </div>
                <Avatar fallback={entry.username?.slice(0, 2).toUpperCase() || '??'} />
                <div>
                  <p className="font-medium">
                    {entry.username}
                    {entry.isCurrentUser && (
                      <span className="ml-2 text-xs text-primary">({t('leaderboard.you', 'You')})</span>
                    )}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {entry.accuracy}% {t('leaderboard.accuracy', 'accuracy')}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {entry.badge}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold">{entry.score.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{t('leaderboard.pts', 'pts')}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('leaderboard.title', 'Leaderboard')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('leaderboard.subtitle', 'Compete with other developers')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {globalLeaderboard.slice(0, 3).map((entry) => (
          <Card
            key={entry.rank}
            className={
              entry.rank === 1 ? 'border-yellow-500/50 bg-yellow-500/5' :
              entry.rank === 2 ? 'border-gray-400/50 bg-gray-500/5' :
              'border-orange-600/50 bg-orange-600/5'
            }
          >
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${
                entry.rank === 1 ? 'text-yellow-600' :
                entry.rank === 2 ? 'text-gray-500' :
                'text-orange-600'
              }`}>
                {getRankIcon(entry.rank)} {entry.rank === 1 ? t('leaderboard.firstPlace', '1st Place') : entry.rank === 2 ? t('leaderboard.secondPlace', '2nd Place') : t('leaderboard.thirdPlace', '3rd Place')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar fallback={entry.username?.slice(0, 2).toUpperCase() || '??'} className="h-12 w-12" />
                <div>
                  <p className="font-semibold">{entry.username}</p>
                  <p className={`text-2xl font-bold ${
                    entry.rank === 1 ? 'text-yellow-600' :
                    entry.rank === 2 ? 'text-gray-500' :
                    'text-orange-600'
                  }`}>
                    {entry.score.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[300px]">
          <TabsTrigger value="global" className="gap-2">
            <Trophy className="h-4 w-4" />
            {t('leaderboard.global', 'Global')}
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-2">
            <Flame className="h-4 w-4" />
            {t('leaderboard.weekly', 'Weekly')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="global" className="mt-4">
          {renderLeaderboard(globalLeaderboard)}
        </TabsContent>
        <TabsContent value="weekly" className="mt-4">
          {renderLeaderboard(weeklyLeaderboard)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
