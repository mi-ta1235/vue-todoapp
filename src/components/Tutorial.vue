<template>
  <div>
    <div class="solid">
      <h1 class="big-text">もう、教授に負けない</h1>
    </div>
    <h1>TODOリスト</h1>
    <div class="todo-content">
      <label v-for="label in options" v-bind:key="label.value">
      <input class="label-radio" type="radio"
             v-model="current"
             v-bind:value="label.value">{{ label.label }}
      </label>
      <table>
        <thead>
        <tr>
          <th class="id">ID</th>
          <th class="comment">タスク</th>
          <th class="state">状態</th>
          <th class="button">-</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in computedTodos" v-bind:key="item.id">
          <th>{{ item.id }}</th>
          <td v-if="item.state == 0">{{ item.comment }}</td>
          <td v-if="item.state == 1" class="done-task">{{ item.comment }}</td>
          <td v-if="item.state == 0" class="doing-state">
            <button class="button" v-on:click="doChangeState(item)">
              <p>{{ labels[item.state] }}</p>
            </button>
          </td>
          <td v-if="item.state == 1" class="done-state">
            <button class="button" v-on:click="doChangeState(item)">
              <p>{{ labels[item.state] }}</p>
            </button>
          </td>
          <td class="button">
            <button v-on:click="doRemove(item)">
              削除
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="add-content">
        <h2>新しい作業の追加</h2>
        <form class="add-form" v-on:submit.prevent="doAdd">
          <input type="text" ref="comment" placeholder="タスクの追加">
          <button type="submit">追加</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import todoStorage from '../plugins/todoStorage'

export default {
  name: 'Tutorial',
  data () {
    return {
      todos: [],
      uid: 0,
      options: [
        { value: -1, label: 'すべて' },
        { value: 0, label: '作業中' },
        { value: 1, label: '完了' }
      ],
      // 選択している options の value を記憶するためのデータ
      // 初期値を「-1」つまり「すべて」にする
      current: -1
    }
  },
  computed: {
    labels () {
      return this.options.reduce(function (a, b) {
        return Object.assign(a, { [b.value]: b.label })
      }, {})
      // キーから見つけやすいように、次のように加工したデータを作成
      // {0: '作業中', 1: '完了', -1: 'すべて'}
    },
    computedTodos: function () {
      // データ current が -1 ならすべて
      // それ以外なら current と state が一致するものだけに絞り込む
      return this.todos.filter(function (el) {
        return this.current < 0 ? true : this.current === el.state
      }, this)
    }
  },
  created () {
    // インスタンス作成時に自動的に fetch() する
    this.todos = todoStorage.fetch()
    this.uid = this.todos.length
  },
  watch: {
    // オプションを使う場合はオブジェクト形式にする
    todos: {
      // 引数はウォッチしているプロパティの変更後の値
      handler: function (todos) {
        todoStorage.save(todos)
      },
      // deep オプションでネストしているデータも監視できる
      deep: true
    }
  },
  methods: {
    // ToDo 追加の処理
    doAdd: function (event, value) {
      // ref で名前を付けておいた要素を参照
      var comment = this.$refs.comment
      // 入力がなければ何もしないで return
      if (!comment.value.length) {
        return
      }
      // { 新しいID, コメント, 作業状態 }
      // というオブジェクトを現在の todos リストへ push
      // 作業状態「state」はデフォルト「作業中=0」で作成
      this.todos.push({
        id: this.uid++,
        comment: comment.value,
        state: 0
      })
      // フォーム要素を空にする
      comment.value = ''
    },
    // 状態変更の処理
    doChangeState: function (item) {
      item.state = item.state ? 0 : 1
    },
    // 削除の処理
    doRemove: function (item) {
      const index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    }
  }
}
</script>

<style scoped>
</style>
