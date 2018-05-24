import _ from 'lodash';
import expect from 'expect.js';
import { updateOldState } from '../vis_update_state';

// eslint-disable-next-line camelcase
import { pre_6_1, since_6_1 } from './vis_update_objs/gauge_objs';

function watchForChanges(obj) {
  const originalObject = _.cloneDeep(obj);
  return () => {
    return _.isEqual(originalObject, obj);
  };
}

describe('updateOldState', () => {

  it('needs to be a function', () => {
    expect(updateOldState).to.be.a('function');
  });

  describe('gauge conversion', () => {

    const oldGaugeChart = {
      type: 'gauge',
      fontSize: 12,
    };

    it('needs to convert fontSize for old gauge charts', () => {
      const isUnchanged = watchForChanges(oldGaugeChart);
      const state = updateOldState(oldGaugeChart);
      expect(state).to.be.eql({
        type: 'gauge',
        gauge: {
          style: {
            fontSize: 12
          }
        }
      });
      // The method is not allowed to modify the passed in object
      expect(isUnchanged()).to.be(true);
    });

    it('needs to convert gauge metrics (pre 6.1) to real metrics', () => {
      const isUnchanged = watchForChanges(pre_6_1);
      const state = updateOldState(pre_6_1);

      expect(state).to.be.eql(since_6_1);
      // The method is not allowed to modify the passed in object
      expect(isUnchanged()).to.be(true);
    });

  });

  describe('terms agg conversion', () => {
    it('should update _term to _key', () => {
      const oldState = {
        aggs: [
          { type: 'terms', params: { orderBy: '_term' } }
        ]
      };
      const state = updateOldState(oldState);
      expect(state.aggs[0].params.orderBy).to.be('_key');
    });
  });

});
