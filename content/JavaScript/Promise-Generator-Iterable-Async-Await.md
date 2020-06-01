---
title: '비동기'
metaTitle: 'Syntax Highlighting is the meta title tag for this page'
metaDescription: 'This is the meta description for this page'
---

웹 시장이 점점 커지면서 웹 환경은 날이 지날수록 발전했다. 특히나, Node.js 환경이 만들어지고 Node.js 기반으로 웹 시장은 점점 진화하고 있다.

웹 환경이 발전하면서 사용성이 계속 중요해지면서 SPA(Single Page Application)와 같은 한 페이지에서 사용하는 것 같은 부드러운 UX가 대세가 되면서, 웹 프론트앤드 프로젝트는 점차 규모가 커졌다. 규모가 커지면서 프로젝트가 따로 분리가 되었고, script내에서 api처리와 같은 비동기 처리가 필요해졌다.

Node.js는 이런 니즈를 파악하고 있었고, 그래서 내부적으로 single-thread 기반의 non-blocking IO를 기반으로 네트워크 작업을 처리할 수 있도록 개발이 되었다.

## 문제

이런 환경에서 비동기 처리는 thread를 고려해서 작성하지 않아도 되는 심플함을 주지만, 작성을 하면서 콜백 지옥에 시달릴 수 있다는 단점을 가지고 있다. 예제 소스를 보면 쉽게 알 수 있다.

```jsx
function getId(phoneNumber) {
  /* … */
}
function getEmail(id) {
  /* … */
}
function getName(email) {
  /* … */
}
function order(name, menu) {
  /* … */
}

function orderCoffee(phoneNumber) {
  const id = getId(phoneNumber);
  const email = getEmail(id);
  const name = getName(email);
  const result = order(name, 'coffee');
  return result;
}
```

본래 목적으로 작성한 소스코드가 이런 형태라고 하자. 매우 직관적으로 알 수 있는 좋은 코드라고 생각된다. 하지만 javascript에서 비동기 처리를 위 소스코드로 한다면 제대로 된 동작을 보장할 수 없다. 그 이유는 Node.js 환경이 Single Thread 기반이기 때문에 동시에 여러 함수를 처리할 수 없는 것에 기인한다. 그래서 아래와 같은 소스코드가 된다.

```jsx
function getId(phoneNumber, callback) {
  /* … */
}
function getEmail(id, callback) {
  /* … */
}
function getName(email, callback) {
  /* … */
}
function order(name, menu, callback) {
  /* … */
}

function orderCoffee(phoneNumber, callback) {
  getId(phoneNumber, function(id) {
    getEmail(id, function(email) {
      getName(email, function(name) {
        order(name, 'coffee', function(result) {
          callback(result);
        });
      });
    });
  });
}
```

이게 바로 콜백 지옥(callback hell)이다. 직관적이긴 하나 가독성이 좋지 못한 것 같다. 위 소스의 가장 큰 문제는 가독성이 아니다. 콜백 함수를 다른 함수로 전달하는 순간 그 함수에 대한 제어권을 잃게 된다. 즉 해당 콜백에 대해서 어떻게 쓰였는지, 에러가 나왔는 지와 같은 처리를 하지 못한다.

## 프로미스 (Promise)의 등장

사실 프로미스는 콜백지옥을 해결하기 위해 나온 개념은 아니다. 하지만 알다시피, 이 지옥을 어느정도 완화 시킬 수는 있다. ES6이전의 웹 생태계에서는 블루버드 같은 모듈을 사용하여 Promise를 활용했지만, 현재는 ES6에 공식으로 포함되어있어, 기본적으로 사용할 수 있다.

```jsx
function getId(phoneNumber) {
  /* … */
}
function getEmail(id) {
  /* … */
}
function getName(email) {
  /* … */
}
function order(name, menu) {
  /* … */
}

function orderCoffee(phoneNumber) {
  return getId(phoneNumber)
    .then(function(id) {
      return getEmail(id);
    })
    .then(function(email) {
      return getName(email);
    })
    .then(function(name) {
      return order(name, 'coffee');
    });
}
```

콜백지옥이 어느정도 해결된 모습이다. `than` 을 사용하여 다음 함수를 실행하도록 구현하였다. 이로써 우리는 than으로 다음 함수을 호출한다는 걸 알 수 있게 되었다.

그런데, ES6에는 errow function으로 여기서 좀 더 깔끔하게 코드를 작성할 수 있다.

```jsx
function getId(phoneNumber) {
  /* … */
}
function getEmail(id) {
  /* … */
}
function getName(email) {
  /* … */
}
function order(name, menu) {
  /* … */
}

function orderCoffee(phoneNumber) {
  return getId(phoneNumber)
    .then(id => getEmail(id))
    .then(email => getName(email))
    .then(name => order(name, 'coffee'));
}
```

아까의 코드보다 훨씬 가독성이 좋은 걸 확인할 수 있다.

하지만 위 코드는 우리가 생각했던 초기의 함수와 괴리감이 있다. 여기서 조금 더 완화를 시킬 수 없을까?

## 비동기 코드를 동기식 코드로 표현하기

```jsx
function getId(phoneNumber) {
  /* … */
}
function getEmail(id) {
  /* … */
}
function getName(email) {
  /* … */
}
function order(name, menu) {
  /* … */
}

function orderCoffee(phoneNumber) {
  const id = getId(phoneNumber);
  const email = getEmail(id);
  const name = getName(email);
  const result = order(name, 'coffee');
  return result;
}
```

우리가 원하던 코드와 순서상으로는 동일하나, 가독성에는 아직 차이가 크다. 이를 어떻게 해결할 수 있을까?

ES6에는 제너레이터(Generator) 문법이 존재한다. 제너레이터를 이용해서 동기식 코드로 표현해보자.

```jsx
function* orderCoffee(phoneNumber) {
  const id = yield getId(phoneNumber);
  const email = yield getEmail(id);
  const name = yield getNameO(email);
  const result = yield order(name, 'coffee');
  return result;
}
```

제너레이터를 이용해서 코드를 작성해봤는데, 이 코드 처럼 이뤄지면 좋겠으나, 위 함수는 동작하지 않는다.

yield를 이용해서 제어권을 넘겨주었다. 하지만 getId가 작업을 완료하는 순간, 다시 반환값과 함께 제어권을 가져오려면 iterator의 `next()` 함수를 호출해야한다.

그러므로 현재는 아래와 같은 코드로 호출해야 할 것이다.

```jsx
const iterator = orderCoffee('010-4434-3374')
iterator.next()

function getId(phoneNumber) {
    ...
    iterator.next()
}
```
