import { Map, Record } from 'immutable';
import isPlainObject from 'is-plain-object';
import { Data } from './data';
import { KeyType } from '../types';
import { Config } from './config';
import { Topic } from './topic';
import { createKey } from '../utils';

type ModelRecordType = {
  topics: Map<KeyType, Topic>;
  data: Map<any, any>;
  config: Config;
  rootTopicKey: KeyType;
  editorRootTopicKey: KeyType;
  focusKey: KeyType;
  focusMode: string;
};

const defaultModelRecord: ModelRecordType = {
  topics: Map(),
  data: null,
  config: null,
  rootTopicKey: null,
  editorRootTopicKey: null,
  focusKey: null,
  focusMode: null
};

export class Model extends Record(defaultModelRecord) {
  static isModel(obj) {
    return obj instanceof Model;
  }
  static create(attrs: any = null): Model {
    if (attrs === null) return Model.createEmpty();

    if (Model.isModel(attrs)) {
      return attrs;
    }

    if (isPlainObject(attrs)) {
      return Model.fromJSON(attrs);
    }

    throw new Error(
      `\`Value.create\` only accepts objects or values, but you passed it: ${attrs}`
    );
  }

  static createEmpty(): Model {
    let model = new Model();
    let rootTopic = Topic.create({ key: createKey() });
    return model
      .update('topics', topics => topics.set(rootTopic.key, rootTopic))
      .set('rootTopicKey', rootTopic.key);
  }

  static fromJSON(object) {
    let model = new Model();
    let {
      data = {},
      topics = [],
      config = {},
      rootTopicKey,
      editorRootTopicKey
    } = object;

    if (editorRootTopicKey === undefined) editorRootTopicKey = rootTopicKey;

    model = model.merge({
      rootTopicKey,
      editorRootTopicKey
    });

    model = model.withMutations(model => {
      topics.forEach(topic => {
        model.update('topics', topics =>
          topics.set(topic.key, Topic.create(topic))
        );
      });
      model.set('config', Config.fromJSON(config));
      model.set('data', Data.fromJSON(data));
    });

    return model;
  }

  get topics(): Map<KeyType, Topic> {
    return this.get('topics');
  }

  get config(): Config {
    return this.get('config');
  }

  get rootTopicKey(): KeyType {
    return this.get('rootTopicKey');
  }

  get editorRootTopicKey(): KeyType {
    return this.get('editorRootTopicKey');
  }

  get focusKey(): KeyType {
    return this.get('focusKey');
  }

  get focusMode(): KeyType {
    return this.get('focusMode');
  }

  getTopic(key: KeyType): Topic {
    return this.topics.get(key);
  }

  get rootTopic() {
    return this.getTopic(this.rootTopicKey);
  }
}