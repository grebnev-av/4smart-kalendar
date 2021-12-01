<template>
	<div>
		<kalendar 
			:configuration="calendar_settings" 
			:events.sync="events"
			:work_time.sync="work_time"
			:materials.sync="materials"
			:students.sync="students"
		>
			<div slot="workTimeEdit">
				<button class="main-button" @click="addWorkTime()" v-if="!calendar_settings.working_hours">
					Время работы
				</button>
				<template v-else>
					<button class="main-button --gray" @click="resetWorkTime()">
						Сбросить
					</button>
					<button class="main-button --red" @click="cancelWorkTime()">
						Отменить
					</button>
					<button class="main-button" @click="saveWorkTime()">
						Сохранить
					</button>
				</template>	
			</div>
		</kalendar>
	</div>
</template>
<script>
const STUDENTS = {
  '10001': {
    name: 'Иванов Сергей'
  },
  '20002': {
    name: 'Петровский Иван'
  },
  '30003': {
    name: 'Академиков Кот'
  },
  '40004': {
    name: 'Дмитриеввввввввввввввввввввввввввввввввввввввввввввввввв Иваннннннннннннннннннннннннннннннннннннннннннннннннннннннннннннннннн'
  }
}
const MATERIALS = {
  '10001': {
    name: 'Present simple. Правила, примеры + тест.'
  },
  '20002': {
    name: 'Present simple таблица.'
  },
  '30003': {
    name: 'Present simple.'
  },
  '40004': {
    name: 'Еще какой-то материал для урока.'
  },
  '50005': {
    name: 'Еще какой-то материал для урокааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааааа'
  }
}
const _EVENTS = [
	{
		from: '2019-06-11T10:00:00.000Z',
		to: '2019-06-11T12:00:00.000Z',
		data: {
			title: '',
			description: '',
      students: [{
        name: 'Иванов Сергей',
        value: 10001
      },],
      materials: [],
		},
	},
];

const WORKING_HOURS = {
	'2021-10-05T07:00:00.000Z': '',
	'2021-10-05T07:30:00.000Z': ''
}

let today = new Date();
// change the dates on _existing events to this week
const startDate = new Date(_EVENTS[0].from).getUTCDate();

function makeNow(dateString) {
	const d = new Date(dateString);
	d.setYear(today.getUTCFullYear());
	d.setMonth(today.getUTCMonth());
	d.setDate(today.getUTCDate() + (d.getUTCDate() - startDate));
	return d.toISOString();
}
const EVENTS = _EVENTS.map(ev => ({
	...ev,
	from: makeNow(ev.from),
	to: makeNow(ev.to),
}));
import Kalendar from '@/lib-components/kalendar-container.vue';
import BaseSelect from '@/lib-components/base/BaseSelect'
export default {
	components: {
		Kalendar,
	},
	data() {
		return {
			events: EVENTS,
			work_time: WORKING_HOURS,
      materials: MATERIALS,
      students: STUDENTS,
			calendar_settings: {
				view_type: 'month',
				cell_height: 30,
				scrollToNow: true,
				//start_day: getCurrentDay(),
				military_time: false,
				working_hours: false,
				read_only: false,
				day_starts_at: 8,
				day_ends_at: 24,
				overlap: false, // перекрытие событий
				hide_dates: ['2019-08-09'],
				hide_days: [],
				past_event_creation: true,
			},
		};
	},
	methods: {
		changeWorkTime() {
			this.calendar_settings.working_hours = !this.calendar_settings.working_hours
			this.calendar_settings.read_only = !this.calendar_settings.read_only
		},
		addWorkTime() {
			this.changeWorkTime()
		},
		saveWorkTime() {
			this.changeWorkTime()
			this.$kalendar.saveWorkHours()
		},
		resetWorkTime() {
			this.$kalendar.resetWorkHours()
		},
		cancelWorkTime() {
			this.changeWorkTime()
			this.$kalendar.cancelWorkHours()
		},
    changeViewType () {

    }
	},
};
</script>
<style lang="scss">
$green: #00f0b5;
$red: #f61067;
</style>
