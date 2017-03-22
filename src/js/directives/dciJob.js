// Copyright 2015 Red Hat, Inc.
//
// Licensed under the Apache License, Version 2.0 (the 'License'); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

'use strict';


require('app')
  .directive('dciJob', [
    '$state', 'api', 'moment', 'status', 'messages',
    function($state, api, moment, status, messages) {
      return {
        link: function(scope) {
          var job = scope.job;
          var start = moment(job.created_at);

          job.time_running = moment(job.updated_at).to(start, true);
          job.updated_at_formatted = moment(job.updated_at).from(moment.moment());

          job.processStatus = function(s) {
            job.status = s;
            job.statusClass = 'bs-callout-' + status[s].color;
            job.glyphicon = status[s].glyphicon;
          };

          job.processStatus(job.status);

          scope.recheck = function() {
            api.jobs.recheck(job.id).then(function(job) {
              $state.go('job.results', {id: job.id});
            });
          };

          scope.remove_job = function(jobs, index) {
            api.jobs.remove(job.id, job.etag).then(function() {
              if (!jobs || !index) {
                $state.go('index');
              } else {
                jobs.splice(index, 1);
              }
              messages.alert('Job "' + job.id + '" deleted !', 'success');
            }, function(err) {
              messages.alert('Something went bad: ' + err.data.message, 'danger');
            });
          };
        },
        templateUrl: '/partials/directives/dci-job.html'
      };
    }]);