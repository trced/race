/** Vue Courbes — un type de course dans le temps. L'axe n'est pas retourné :
 *  une durée qui baisse descend, et la légende le dit. */

import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { EmptyState } from '../../components/Feedback.tsx'
import { SelectField } from '../../components/TextField.tsx'
import { useI18n } from '../../i18n/index.tsx'
import type { MessageKey } from '../../i18n/index.tsx'
import {
  buildCurve,
  curveScale,
  curveTypes,
  timeBounds,
  yearTicks,
} from '../../lib/curves.ts'
import type { CurveMetric, CurvePoint } from '../../lib/curves.ts'
import { formatDuration, secondsToDuration } from '../../lib/format.ts'
import type { Race, RaceType } from '../../lib/types.ts'
import { useFormat } from '../useFormat.ts'
import { ListView } from './ListView.tsx'

/** La bibliothèque prend des nombres, pas des longueurs CSS : les deux seules
 *  mesures du projet qui ne peuvent pas être des jetons. */
const CHART_HEIGHT = 260
const AXIS_WIDTH = 78

export function CurvesView({
  races,
  onOpen,
}: {
  races: Race[]
  onOpen: (race: Race) => void
}) {
  const { t, tp } = useI18n()
  const format = useFormat()

  const types = useMemo(() => curveTypes(races), [races])

  // Le type le plus couru d'abord : c'est celui qui a une courbe à montrer.
  const suggested = useMemo(() => {
    let best: RaceType | null = null
    let count = 0
    for (const type of types) {
      const n = races.filter((race) => race.type === type).length
      if (n > count) {
        best = type
        count = n
      }
    }
    return best
  }, [types, races])

  const [chosen, setChosen] = useState<RaceType | null>(null)
  const type = chosen && types.includes(chosen) ? chosen : suggested

  const curve = useMemo(
    () => (type ? buildCurve(races, type) : null),
    [races, type],
  )

  if (!curve || !type) {
    return (
      <EmptyState
        title={t('app.curves.empty.title')}
        body={t('app.curves.empty.body')}
      />
    )
  }

  const { points, metric } = curve
  const vertical = curveScale(points)
  const horizontal = timeBounds(points)

  const axisValue = (value: number): string =>
    metric === 'pace'
      ? format.paceFrom(value)
      : formatDuration(secondsToDuration(value))

  const axisLabel =
    metric === 'pace'
      ? t('app.curves.axis.pace', { unit: format.distanceUnit })
      : t('app.curves.axis.time')

  const years = points.map((point) => point.iso.slice(0, 4))
  const first = years[0]
  const last = years[years.length - 1]

  return (
    <>
      <div className="curves">
        <SelectField
          label={t('app.curves.selectLabel')}
          value={type}
          onValueChange={(next) => setChosen(next as RaceType)}
          options={types.map((value) => ({
            value,
            label: t(`app.type.${value}` as MessageKey),
          }))}
        />

        {points.length === 0 || !vertical || !horizontal ? (
          <p className="curves__note">{t('app.curves.noPoints')}</p>
        ) : (
          <>
            {/* La légende est du texte : elle nomme les axes, elle ne code
                rien par la couleur. */}
            <dl className="curves__legend">
              <div className="curves__legend-item">
                <dt>{t('app.curves.legend.series')}</dt>
                <dd>
                  <span className="curves__swatch" aria-hidden="true" />
                  {t(`app.type.${type}` as MessageKey)}
                </dd>
              </div>
              <div className="curves__legend-item">
                <dt>{t('app.curves.legend.vertical')}</dt>
                <dd>{axisLabel}</dd>
              </div>
              <div className="curves__legend-item">
                <dt>{t('app.curves.legend.horizontal')}</dt>
                <dd>{t('app.curves.legend.date')}</dd>
              </div>
            </dl>

            <div
              className="curves__chart"
              role="img"
              aria-label={t('app.curves.chartAria', {
                type: t(`app.type.${type}` as MessageKey),
                n: points.length,
                axis: axisLabel,
              })}
            >
              <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                <LineChart
                  data={points}
                  margin={{ top: 8, right: 12, bottom: 4, left: 0 }}
                  // La couche clavier de la bibliothèque poserait un élément
                  // focalisable dans une image : c'est la liste qui sert.
                  accessibilityLayer={false}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    type="number"
                    dataKey="t"
                    scale="time"
                    domain={[horizontal.min, horizontal.max]}
                    ticks={yearTicks(points)}
                    interval="preserveStartEnd"
                    minTickGap={28}
                    tickFormatter={(value: number) =>
                      new Date(value).getFullYear().toString()
                    }
                    tickMargin={8}
                  />
                  <YAxis
                    type="number"
                    dataKey="value"
                    domain={[vertical.min, vertical.max]}
                    ticks={vertical.ticks}
                    tickFormatter={axisValue}
                    tickMargin={8}
                    width={AXIS_WIDTH}
                  />
                  <Tooltip
                    isAnimationActive={false}
                    cursor={{ strokeDasharray: '2 3' }}
                    content={
                      <CurveTooltip
                        metric={metric}
                        formatValue={axisValue}
                        formatDate={format.date}
                        formatDistance={format.distance}
                      />
                    }
                  />
                  {/* `linear` : une spline inventerait des valeurs entre
                      deux courses. */}
                  <Line
                    type="linear"
                    dataKey="value"
                    strokeWidth={1}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 4, strokeWidth: 1 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="curves__note">
              {[
                tp('app.curves.count', points.length),
                first && last && first !== last
                  ? t('app.curves.span', { first, last })
                  : first,
                t(
                  metric === 'pace'
                    ? 'app.curves.reading.pace'
                    : 'app.curves.reading.time',
                ),
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </>
        )}
      </div>

      {/* La liste porte la série au clavier et à la synthèse vocale, et c'est
          par elle qu'on ouvre une course. Du plus récent, comme ailleurs. */}
      <ListView
        races={points.map((point) => point.race).reverse()}
        showYears={false}
        onOpen={onOpen}
      />
    </>
  )
}

/** Celle de la bibliothèque arrive en cadre blanc avec une ombre portée. */
function CurveTooltip({
  active,
  payload,
  metric,
  formatValue,
  formatDate,
  formatDistance,
}: {
  active?: boolean | undefined
  payload?: { payload: CurvePoint }[] | undefined
  metric: CurveMetric
  formatValue: (value: number) => string
  formatDate: (iso: string) => string
  formatDistance: (km: number) => string
}) {
  const point = active ? payload?.[0]?.payload : undefined
  if (!point) return null

  return (
    <div className="curves__tip">
      <span className="curves__tip-name">{point.race.name}</span>
      <span className="curves__tip-line">{formatDate(point.iso)}</span>
      <span className="curves__tip-line">
        {[
          formatValue(point.value),
          metric === 'pace' ? formatDistance(point.race.distance) : '',
        ]
          .filter(Boolean)
          .join(' · ')}
      </span>
    </div>
  )
}
