<template>
  <div class="created-card">
    <span class="created-card__x" @click="close">
      <kalendar-x-button />
    </span>
    <div class="created-card__header">
      <span class="created-card__header-icon">
        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.66699" y="3.5" width="16.6667" height="15.8333" rx="3" stroke="#6E7191" stroke-width="2"/>
          <path d="M5.83301 1.8335V3.50016" stroke="#6E7191" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14.167 1.8335V3.50016" stroke="#6E7191" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M1.66699 7.6665H18.3337" stroke="#6E7191" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6.25 11.8335H7.91667" stroke="#6E7191" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.083 11.8335H13.7497" stroke="#6E7191" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6.25 15.1665H7.91667" stroke="#6E7191" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.083 15.1665H13.7497" stroke="#6E7191" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
       </svg>
      </span>
      <span class="created-card__header-text">
        Запланировать занятие
      </span>
    </div>
    <div>
      <template v-if="addedStudents.length > 0">
        <ul class="b-added-students">
          <li
              class="b-added-students__item"
              v-for="(student, index) in addedStudents"
              :key="student.value"
          >
            <span
                class="b-added-students__item-x"
                @click="removeStudent(index)"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.08268 1.73925L8.26018 0.916748L4.99935 4.17758L1.73852 0.916748L0.916016 1.73925L4.17685 5.00008L0.916016 8.26092L1.73852 9.08342L4.99935 5.82258L8.26018 9.08342L9.08268 8.26092L5.82185 5.00008L9.08268 1.73925Z" fill="#777777"/>
              </svg>
            </span>
            {{ student.name }}
          </li>
        </ul>
        <kalendar-open-lesson />
      </template>
      <base-select
          v-else
          defaultText="Выбрать студента..."
          :options="studentSelect.filteredList"
          :value="studentSelect.value"
          v-model="studentSelect.selected"
          :search="true"
          @input="addStudent(studentSelect.selected)"
      />
    </div>
    <div class="b-date-time">
      <span class="b-date-time__date">
        {{ formatDay(start_time) }}
      </span>
      <base-select
          defaultText="Начало"
          :options="startTimeSelect.filteredList"
          v-model="startTimeSelect.selected"
          @input="() => changeTime(startTimeSelect.selected.value, 'start')"
      />
      <span class="b-delimiter" />
      <base-select
          defaultText="Конец"
          :options="endTimeSelect.filteredList"
          v-model="endTimeSelect.selected"
          @input="() => changeTime(endTimeSelect.selected.value, 'end')"
          :error="errorSelectedTime"
      />
    </div>
    <div class="b-materials">
      <button class="b-materials__add-button"
        v-if="!isShowMaterialSelect"
        @click="showMaterialSelect"
      >
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.1667 9.66667H13.8333V12.1667H16.3333V13.8333H13.8333V16.3333H12.1667V13.8333H9.66667V12.1667H12.1667V9.66667ZM8 12.1667V10.5H3.83333V12.1667H8ZM12.1667 7.16667H3.83333V8.83333H10.2417C8.89167 9.725 8 11.2583 8 13C8 13.9083 8.24167 14.7667 8.66667 15.5H2.16667C1.24167 15.5 0.5 14.75 0.5 13.8333V2.16667C0.5 1.24167 1.24167 0.5 2.16667 0.5H13.8333C14.2754 0.5 14.6993 0.675595 15.0118 0.988155C15.3244 1.30072 15.5 1.72464 15.5 2.16667V8.66667C14.7667 8.24167 13.9083 8 13 8L12.1667 8.06667V7.16667ZM12.1667 5.5V3.83333H3.83333V5.5H12.1667Z" fill="#2089FF"/>
        </svg>
        Добавить материалы к уроку
      </button>
      <base-select
          v-else
          defaultText="Выбрать материал к уроку..."
          :options="materialSelect.filteredList"
          :value="materialSelect.value"
          v-model="materialSelect.selected"
          :search="true"
          @input="addMaterial(materialSelect.selected)"
      />
      <ul class="b-materials__list">
        <li
            class="b-materials__list-item"
            v-for="(student, index) in addedMaterials"
            :key="student.value"
        >
            <span
                class="b-materials__list-item-x"
                @click="removeMaterial(index)"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.08268 1.73925L8.26018 0.916748L4.99935 4.17758L1.73852 0.916748L0.916016 1.73925L4.17685 5.00008L0.916016 8.26092L1.73852 9.08342L4.99935 5.82258L8.26018 9.08342L9.08268 8.26092L5.82185 5.00008L9.08268 1.73925Z" fill="#777777"/>
              </svg>
            </span>
          {{ student.name }}
        </li>
      </ul>
    </div>
    <div class="b-buttons" v-if="enabledSave">
      <button class="main-button" @click="addEvent(popup_information)">
        Сохранить
      </button>
    </div>
  </div>
</template>

<script>
import KalendarXButton from '@/lib-components/kalendar-x-button';
import KalendarOpenLesson from '@/lib-components/kalendar-open-lesson';
import BaseSelect from '@/lib-components/base/BaseSelect'

import {
  getFormattedWeekDayTime,
  getFormattedMonth,
  getLocaleTime, cloneObject,
} from './utils.js';
import hourUtils from "./hours";

const EVENT = {
  title: 'Новое занятие',
  description: null,
  userId: null,
  materials: []
};

export default {
  name: "kalendar-popup-card-slot",
  components: {
    KalendarXButton,
    KalendarOpenLesson,
    BaseSelect
  },
  inject: ['kalendar_materials', 'kalendar_students'],
  props: ['popup_information'],
  data () {
    return {
      new_event_data: {...EVENT},
      studentSelect: {
        value: {},
        list: Object.keys(this.kalendar_students).map(m => ({ value: m, name: this.kalendar_students[m].name})),
        filteredList: [],
        selected: {}
      },
      materialSelect: {
        value: {},
        list: Object.keys(this.kalendar_materials).map(m => ({ value: m, name: this.kalendar_materials[m].name})),
        filteredList: [],
        selected: {}
      },
      start_time: this.popup_information.start_time,
      end_time: this.popup_information.end_time,
      addedStudents: [],
      addedMaterials: [],
      isShowMaterialSelect: false,
      start_time_h: 0,
      end_time_h: 0,
      startTimeSelect: {
        list: [],
        filteredList: [],
        selected: {}
      },
      endTimeSelect: {
        list: [],
        filteredList: [],
        selected: {}
      },
      day_events: []
    }
  },
  computed: {
    hourRange () {
      return [this.$kalendar.options.day_starts_at, this.$kalendar.options.day_ends_at]
    },
    enabledSave () {
      return this.addedStudents.length > 0 && !this.errorSelectedTime
    },
    errorSelectedTime () {
      const endTimeH = this.end_time_h === 0 ? 2400 : this.end_time_h
      return endTimeH - this.start_time_h < 0
    }
  },
  created () {
    const { start_time, end_time, day_events } =  cloneObject(this.popup_information)
    this.start_time = start_time;
    this.start_time_h = this.getNumHour(this.start_time);
    this.end_time = end_time;
    this.end_time_h = this.getNumHour(this.end_time, 'end');
    this.day_events = day_events;
  },
  mounted () {
    this.filterStudents()
    this.filterMaterials()
    this.filterTimes()
    this.startTimeSelect.selected = this.setTime('start');
    this.endTimeSelect.selected = this.setTime('end');
  },
  methods: {
    filterTimes () {
      this.filterTime('start')
      this.filterTime('end')
    },
    addEvent () {
      let payload = {
        data: {
          title: this.new_event_data.title,
          description: this.new_event_data.description,
          students: this.addedStudents,
          materials: this.addedMaterials
        },
        from: this.start_time,
        to: this.end_time,
      };

      this.clearFormData();
      this.$kalendar.addNewEvent(payload);
      this.$kalendar.closePopups();
    },
    clearFormData () {
      this.new_event_data = {...EVENT};
    },
    close () {
      this.$emit('close')
    },
    addStudent (value) {
      this.addedStudents.push(value);
      this.studentSelect.selected = {}
      this.filterStudents()
    },
    removeStudent (index) {
      this.addedStudents.splice(index, 1);
      this.filterStudents()
    },
    filterStudents () {
      this.studentSelect.filteredList = this.studentSelect.list.filter(s => {
        if (this.addedStudents.length === 0) {
          return true
        }

        return this.addedStudents.find(addedS => addedS.value === s.value) === undefined
      })
    },
    formatDay (date ) {
      let isoDate = new Date(date);

      let dayName = getFormattedWeekDayTime(isoDate).split(',')[0];
      let dayMonth = getFormattedMonth(isoDate);
      return `${dayName}, ${dayMonth}`;
    },
    showMaterialSelect () {
      this.isShowMaterialSelect = true
    },
    hideMaterialSelect () {
      this.isShowMaterialSelect = false
    },
    addMaterial (value) {
      this.addedMaterials.push(value);
      this.materialSelect.selected = {}
      this.filterMaterials()
      this.hideMaterialSelect()
    },
    filterMaterials () {
      this.materialSelect.filteredList = this.materialSelect.list.filter(s => {
        if (this.addedMaterials.length === 0) {
          return true
        }

        return this.addedMaterials.find(addedS => addedS.value === s.value) === undefined
      })
    },
    removeMaterial (index) {
      this.addedMaterials.splice(index, 1);
      this.filterMaterials()
    },
    changeTime (value, timeName) {
      const dataTime = value.split(':');
      const date = new Date(this[`${timeName}_time`])

      const newDate = new Date(date.setHours(dataTime[0], dataTime[1]))

      this[`${timeName}_time`] = getLocaleTime(newDate.toISOString()) // this.startTime or this.endTime
      this[`${timeName}_time_h`] = +dataTime[0] * 100

      if (timeName === 'end' && this[`${timeName}_time_h`] === 0) { // если конец события в 00:00
        this[`${timeName}_time_h`] = 2400
      }

      this.filterTimes()

      if (this.start_time_h > this.end_time_h) { // если при переключении выбрали время начала больше конца
        this.endTimeSelect.selected = this.endTimeSelect.filteredList[0]
        this.end_time_h = +this.endTimeSelect.selected.value.replace(':','')
        this.changeTime(this.endTimeSelect.selected.value, 'end')
      }
    },
    filterTime (prop) {
      let maxStartTime = this.hourRange[0] * 100;
      let maxEndTime = this.hourRange[1] * 100;

      Object.keys(this.day_events).forEach(key => {
        const eventStartTime = +this.getNumHour(this.day_events[key][0].start.value); // // 2021-10-22T18:00:00+03:00 => 1800
        const eventEndTime = +this.getNumHour(this.day_events[key][0].end.value); //

        if (eventStartTime <= this.start_time_h && eventEndTime <= this.start_time_h) {
          if (eventEndTime > maxStartTime) {
            maxStartTime = eventEndTime
          }
        }

        if (eventStartTime >= this.end_time_h && eventEndTime >= this.end_time_h) {
          if (eventStartTime < maxEndTime) {
            maxEndTime = eventStartTime
          }
        }
      })

      let all_hours = hourUtils.getAllHours().filter(h => {
        const numHour = +h.slice(0, 2) // берем время в виде 10
        const numHour10 = +h.slice(0, 5).replace(':','') // берем время в виде 10:30 и переводим в число 1030

        if (numHour < this.hourRange[0] || numHour > this.hourRange[1]) { // убираем часы не попадающие в режим работы day_starts_at и day_ends_at календаря
          return false
        }

        if (prop === 'start' && numHour10 === this.getNumHour(this.end_time, 'end')) {
          return false
        }

        if (prop === 'end' && numHour10 < this.getNumHour(this.start_time)) {
          return false
        }

        if (prop === 'end' && h.indexOf('00:00:00') !== -1) {
          return false
        }

        return (h.indexOf(':00:') !== -1 || h.indexOf(':30:') !== -1) && numHour10 >= maxStartTime && numHour10 <= maxEndTime// выбираем только кратные 30мин
      });

      this[`${prop}TimeSelect`].filteredList = all_hours.map(h => {
        return { name: h.slice(0, 5), value: h.slice(0, 5)}
      })
    },
    setTime (prop) {
      const time = this[`${prop}_time`].slice(11, 16);

      return { name: time, value: time}
    },
    getNumHour (time, prop) {
      let numHour = +time.slice(11, 16).replace(':','') // 2021-10-22T18:00:00+03:00 => 1800

      if (prop === 'end' && numHour === 0) { // если конец события в 00:00
        numHour = 2400
      }

      return numHour
    }
  }
}
</script>

<style lang="scss">
.created-card {
  display: flex;
  flex-direction: column;
  padding: 20px 20px 10px 30px;
  position: relative;
  &__x {
    position: absolute;
    top: 0;
    right: 0;
  }
  &__header {
    display: flex;
    align-items: center;
    margin: 0 0 20px 0;
    &-icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin: 0 10px 0 0;
    }
    &-text {
      font-size: 16px;
      font-weight: 600;
      color: #0967D1;
      text-transform: uppercase;
    }
  }
}
.b-added-students {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0 0 10px !important;
  &__item {
    border-right: none !important;
    margin: 0 20px 0 0;
    word-break: break-word;
    &-x {
      width: 8px;
      height: 8px;
      display: inline-block;
      margin: 0 7px 0 0;
      cursor: pointer;
    }
  }
}

.b-buttons {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
.b-date-time {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  padding: 20px 0;
  &__date {
    &:first-letter {
      text-transform: uppercase;
    }
    display: inline-block;
    margin: 0 30px 0 0;
  }
}
.b-delimiter {
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:before {
    content: '';
    display: inline-block;
    border-bottom: 1px solid rgba(#DADADA,1);
    width: 10px;
  }
}
.b-materials {
  &__add-button {
    color: #2089FF;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    & > svg {
      margin: 0 9px 0 0;
    }
  }
  &__select {

  }
  &__list {
    display: flex;
    flex-direction: column;
    margin: 10px 0 0 10px !important;
    &-item {
      border-right: none !important;
      margin: 0 20px 0 0;
      word-break: break-word;
      &-x {
        width: 8px;
        height: 8px;
        display: inline-block;
        margin: 0 7px 0 0;
        cursor: pointer;
      }
    }
  }
}
</style>