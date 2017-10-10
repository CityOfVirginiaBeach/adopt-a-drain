require 'rake'

namespace :data do
  task load_things: :environment do
    require 'thing_importer'
    ThingImporter.load('https://dev.vbgov.com/_assets/_apis/CVB-Drains.csv')
  end
end
