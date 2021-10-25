<template>
  <div class="b-open-lesson">
    <button>Открыть урок</button>
    <span>https://4smart.pro/4fx-dko-dl5</span>
  </div>
</template>

<script>
export default {
  name: "kalendar-open-lesson"
}
</script>

<style lang="scss" scoped>
.b-open-lesson {
  width: 100%;
  color: #777777;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  & > button {
    color: #2089FF;
    cursor: pointer;
    border: none;
    background: transparent;
    margin: 0 5px;
  }
  & > span {
    padding: 1px 0 0;
  }
}
</style>